"""
PDF Extract & Screenshot
Offline PDF search tool with visual QA validation.
Built for non-technical users — double-click and go.
"""

import sys
import os

# Windows terminal encoding fix
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
import re
import uuid
import base64
import json
from io import BytesIO
from datetime import datetime

from flask import Flask, request, render_template, jsonify, send_file
import fitz  # PyMuPDF

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024  # 1 GB max
app.config['SECRET_KEY'] = 'pdf-puppy-sniffs-here'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Keep processed docs in memory for fast re-searches
# Keyed by session_id
_sessions = {}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _cleanup_old_sessions():
    """Nuke sessions older than 30 minutes (don't let memory balloon)."""
    now = datetime.now()
    stale = [sid for sid, s in _sessions.items()
             if (now - s['created']).total_seconds() > 1800]
    for sid in stale:
        _sessions.pop(sid, None)


def _search_page_words(page, search_text, case_sensitive, whole_word, use_regex):
    """
    Search a single page using multiple strategies.
    Returns (rects, error_string).
    """
    # ---------- Regex path ----------
    if use_regex:
        flags = 0 if case_sensitive else re.IGNORECASE
        try:
            compiled = re.compile(search_text, flags)
        except re.error as e:
            return [], str(e)

        # Get all text content and words with positions
        all_text = page.get_text('text')
        words = page.get_text('words')  # [(x0,y0,x1,y1,word,block,line,word_no), ...]

        matches = list(compiled.finditer(all_text))
        if not matches:
            return [], None

        # Map character positions to word-based rects
        # Build a char-to-word index from the words list
        rects = _match_regex_to_rects(all_text, words, matches, case_sensitive)
        return rects, None

    # ---------- Simple substring path ----------
    # PyMuPDF's search_for is always case-insensitive, so for case-sensitive
    # searches we need to use the words-based approach
    if case_sensitive:
        words = page.get_text('words')
        rects = _match_substring_case_sensitive(words, search_text, whole_word)
        return rects, None

    # Case-insensitive simple search: use PyMuPDF's fast search_for
    rects = page.search_for(search_text, quads=False)

    if whole_word:
        filtered = []
        for rect in rects:
            extracted = page.get_text('text', clip=rect).strip()
            pattern = re.compile(r'\b' + re.escape(search_text) + r'\b', re.IGNORECASE)
            if pattern.search(extracted):
                filtered.append(rect)
        return filtered, None

    return rects, None


def _match_substring_case_sensitive(words, search_text, whole_word):
    """Find case-sensitive substring matches from word list."""
    search_lower = search_text.lower()
    search_words = search_text.split()
    rects = []

    if whole_word and len(search_words) == 1:
        # Single whole word: match exact words
        for w in words:
            if w[4] == search_text:  # exact match
                rects.append(fitz.Rect(w[0], w[1], w[2], w[3]))
        return rects

    if whole_word:
        # Multi-word phrase: match consecutive words
        word_texts = [w[4] for w in words]
        phrase = ' '.join(word_texts)
        # Find the phrase, case-sensitive, whole word at boundaries
        pattern = re.compile(r'(?<![^\s])' + re.escape(search_text) + r'(?![^\s])')
        for m in pattern.finditer(phrase):
            start_idx = len(phrase[:m.start()].split()) - 1
            end_idx = start_idx + len(search_words)
            if 0 <= start_idx < len(words) and end_idx <= len(words):
                x0 = min(w[0] for w in words[start_idx:end_idx])
                y0 = min(w[1] for w in words[start_idx:end_idx])
                x1 = max(w[2] for w in words[start_idx:end_idx])
                y1 = max(w[3] for w in words[start_idx:end_idx])
                rects.append(fitz.Rect(x0, y0, x1, y1))
        return rects

    # Simple substring, case-sensitive: iterate through words
    # Build a continuous text mapping
    full_text = ' '
    word_positions = []
    for w in words:
        word_positions.append((len(full_text), len(full_text) + len(w[4]), w))
        full_text += w[4] + ' '

    # Find all occurrences
    start = 0
    while True:
        pos = full_text.find(search_text, start)
        if pos == -1:
            break
        # Find which words this spans
        match_end = pos + len(search_text)
        covering_words = [
            wp for wp in word_positions
            if wp[0] < match_end and wp[1] > pos
        ]
        if covering_words:
            x0 = min(wp[2][0] for wp in covering_words)
            y0 = min(wp[2][1] for wp in covering_words)
            x1 = max(wp[2][2] for wp in covering_words)
            y1 = max(wp[2][3] for wp in covering_words)
            rects.append(fitz.Rect(x0, y0, x1, y1))
        start = pos + 1

    return rects


def _match_regex_to_rects(all_text, words, matches, case_sensitive):
    """Map regex match objects to bounding boxes using word positions."""
    # Build character-offset to word mapping
    char_map = []  # list of (char_start, char_end, word_rect)
    pos = 0
    for w in words:
        word_start = all_text.find(w[4], pos)
        if word_start == -1:
            # Word not found sequentially, try from start
            word_start = all_text.find(w[4])
        if word_start != -1:
            char_map.append((word_start, word_start + len(w[4]), fitz.Rect(w[0], w[1], w[2], w[3])))
            pos = word_start + len(w[4])

    rects = []
    for m in matches:
        m_start, m_end = m.start(), m.end()
        covering = [
            cm for cm in char_map
            if cm[0] < m_end and cm[1] > m_start
        ]
        if covering:
            x0 = min(c[2].x0 for c in covering)
            y0 = min(c[2].y0 for c in covering)
            x1 = max(c[2].x1 for c in covering)
            y1 = max(c[2].y1 for c in covering)
            rects.append(fitz.Rect(x0, y0, x1, y1))

    return rects


def _render_screenshot(page, rect, zoom, padding):
    """
    Render a zoomed-in screenshot of the area around *rect* on *page*.
    Returns a base64-encoded PNG.
    """
    pad = max(padding, 5)
    clip_rect = fitz.Rect(
        max(rect.x0 - pad, 0),
        max(rect.y0 - pad, 0),
        min(rect.x1 + pad, page.rect.width),
        min(rect.y1 + pad, page.rect.height),
    )
    
    zoom_matrix = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=zoom_matrix, clip=clip_rect)
    img_bytes = pix.tobytes('png')
    b64 = base64.b64encode(img_bytes).decode('utf-8')
    return f'data:image/png;base64,{b64}'


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route('/')
def index():
    """Serve the main page."""
    return render_template('index.html')


@app.route('/api/upload', methods=['POST'])
def upload_pdf():
    """Upload a PDF and create a session for searching."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'File must be a PDF'}), 400
    
    # Save to a unique path
    session_id = uuid.uuid4().hex[:12]
    ext = os.path.splitext(file.filename)[1] or '.pdf'
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{session_id}{ext}')
    file.save(save_path)
    
    # Open with PyMuPDF and gather page count
    try:
        doc = fitz.open(save_path)
        page_count = len(doc)
        file_size = os.path.getsize(save_path)
        
        _cleanup_old_sessions()
        _sessions[session_id] = {
            'doc': doc,
            'path': save_path,
            'filename': file.filename,
            'page_count': page_count,
            'file_size': file_size,
            'created': datetime.now(),
        }
        
        return jsonify({
            'session_id': session_id,
            'filename': file.filename,
            'page_count': page_count,
            'file_size': file_size,
        })
    except Exception as e:
        return jsonify({'error': f'Failed to open PDF: {str(e)}'}), 500


@app.route('/api/search', methods=['POST'])
def search_pdf():
    """
    Search the uploaded PDF with user-configured options.
    
    JSON body:
    {
        "session_id": "...",
        "search_text": "Invoice Number",
        "case_sensitive": false,
        "whole_word": true,
        "use_regex": false,
        "page_start": 1,
        "page_end": null,
        "zoom": 3.0,
        "padding": 20,
        "max_per_page": 10
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON body'}), 400
    
    session_id = data.get('session_id')
    if not session_id or session_id not in _sessions:
        return jsonify({'error': 'Invalid or expired session. Please re-upload.'}), 400
    
    session = _sessions[session_id]
    doc = session['doc']
    
    search_text = data.get('search_text', '').strip()
    if not search_text:
        return jsonify({'error': 'Search text cannot be empty'}), 400
    
    case_sensitive = data.get('case_sensitive', False)
    whole_word = data.get('whole_word', False)
    use_regex = data.get('use_regex', False)
    page_start = max(data.get('page_start', 1), 1)
    page_end = data.get('page_end', None) or len(doc)
    page_end = min(page_end, len(doc))
    zoom = max(float(data.get('zoom', 3.0)), 1.0)
    padding = int(data.get('padding', 20))
    max_per_page = int(data.get('max_per_page', 50))
    
    results = []
    total_matches = 0
    
    for page_num in range(page_start - 1, page_end):
        page = doc[page_num]
        
        rects, error = _search_page_words(
            page, search_text, case_sensitive, whole_word, use_regex
        )
        if error:
            return jsonify({'error': error}), 400
        
        page_matches = 0
        for rect in rects:
            if page_matches >= max_per_page:
                break
            
            # Extract text from the area
            extracted_text = page.get_text('text', clip=rect).strip()
            if not extracted_text:
                continue
            
            # Render zoomed screenshot
            screenshot = _render_screenshot(page, rect, zoom, padding)
            
            results.append({
                'page': page_num + 1,
                'page_label': page.get_label() or str(page_num + 1),
                'rect': {
                    'x0': rect.x0, 'y0': rect.y0,
                    'x1': rect.x1, 'y1': rect.y1,
                    'width': rect.width, 'height': rect.height,
                },
                'text': extracted_text,
                'screenshot': screenshot,
            })
            page_matches += 1
            total_matches += 1
    
    # Update session with last search params
    session['last_search'] = {
        'text': search_text,
        'results_count': total_matches,
    }
    
    return jsonify({
        'results': results,
        'total_matches': total_matches,
        'pages_searched': page_end - page_start + 1,
        'session_id': session_id,
    })


@app.route('/api/session/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get session info (filename, page count, etc.)."""
    if session_id not in _sessions:
        return jsonify({'error': 'Session not found'}), 404
    
    session = _sessions[session_id]
    return jsonify({
        'session_id': session_id,
        'filename': session['filename'],
        'page_count': session['page_count'],
        'file_size': session['file_size'],
    })


@app.route('/api/page_image/<session_id>/<int:page_num>', methods=['GET'])
def get_page_image(session_id, page_num):
    """Get a full-page image (for thumbnail/preview) at a given zoom."""
    if session_id not in _sessions:
        return jsonify({'error': 'Session not found'}), 404
    
    zoom = float(request.args.get('zoom', 1.0))
    doc = _sessions[session_id]['doc']
    
    if page_num < 1 or page_num > len(doc):
        return jsonify({'error': 'Invalid page number'}), 400
    
    page = doc[page_num - 1]
    zoom_matrix = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=zoom_matrix)
    img_bytes = pix.tobytes('png')
    
    return send_file(
        BytesIO(img_bytes),
        mimetype='image/png',
        as_attachment=False,
    )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == '__main__':
    import webbrowser
    port = int(os.environ.get('PORT', 8080))
    print(f"[PDF Extract & Screenshot] Running at http://127.0.0.1:{port}")
    print(f"[PDF Extract & Screenshot] Open your browser and start sniffing PDFs!")
    webbrowser.open(f'http://127.0.0.1:{port}')
    app.run(host='127.0.0.1', port=port, debug=False, threaded=True)
