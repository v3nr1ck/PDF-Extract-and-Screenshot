"""Test the search functions directly."""
import sys, os
sys.path.insert(0, '.')
import fitz

# Copy the relevant functions here for testing
def _match_substring_case_sensitive(words, search_text, whole_word):
    """Find case-sensitive substring matches from word list."""
    search_words = search_text.split()
    rects = []

    if whole_word and len(search_words) == 1:
        for w in words:
            if w[4] == search_text:
                rects.append(fitz.Rect(w[0], w[1], w[2], w[3]))
        return rects

    # Simple substring, case-sensitive
    full_text = ' '
    word_positions = []
    for w in words:
        word_positions.append((len(full_text), len(full_text) + len(w[4]), w))
        full_text += w[4] + ' '

    print(f"  full_text = {repr(full_text)}")
    
    start = 0
    while True:
        pos = full_text.find(search_text, start)
        print(f"  search for '{search_text}' from pos {start}: found at {pos}")
        if pos == -1:
            break
        match_end = pos + len(search_text)
        covering_words = [
            wp for wp in word_positions
            if wp[0] < match_end and wp[1] > pos
        ]
        print(f"  match_end={match_end}, covering_words count={len(covering_words)}")
        if covering_words:
            x0 = min(wp[2][0] for wp in covering_words)
            y0 = min(wp[2][1] for wp in covering_words)
            x1 = max(wp[2][2] for wp in covering_words)
            y1 = max(wp[2][3] for wp in covering_words)
            rects.append(fitz.Rect(x0, y0, x1, y1))
            print(f"  -> rect: ({x0},{y0},{x1},{y1})")
        start = pos + 1

    return rects


doc = fitz.open("test_invoice.pdf")
page = doc[0]
words = page.get_text('words')

print("=== Case-sensitive search for 'invoice' ===")
rects = _match_substring_case_sensitive(words, "invoice", whole_word=False)
print(f"Found {len(rects)} matches")

print("\n=== Case-sensitive search for 'INVOICE' ===")
rects = _match_substring_case_sensitive(words, "INVOICE", whole_word=False)
print(f"Found {len(rects)} matches")
