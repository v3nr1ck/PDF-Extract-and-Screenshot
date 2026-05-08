const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerShading = { fill: "1a1a2e", type: ShadingType.CLEAR };

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        run: { size: 32, bold: true, font: "Calibri", color: "1a1a2e" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        run: { size: 28, bold: true, font: "Calibri", color: "333333" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        run: { size: 24, bold: true, font: "Calibri", color: "555555" },
        paragraph: { spacing: { before: 120, after: 80 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: "bullet",
            text: "•",
            alignment: "left",
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          },
          {
            level: 1,
            format: "bullet",
            text: "◦",
            alignment: "left",
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } }
          }
        ]
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: "decimal",
            text: "%1.",
            alignment: "left",
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("PDF Extract & Screenshot – Code Review")]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Project: ", bold: true }),
          new TextRun("Non-technical PDF search tool with visual QA validation")
        ],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Date: ", bold: true }),
          new TextRun("May 7, 2026")
        ],
        spacing: { after: 240 }
      }),

      // EXECUTIVE SUMMARY
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Executive Summary")]
      }),
      new Paragraph({
        children: [new TextRun("Your application successfully solves the core problem: enabling non-technical users to upload PDFs, search them offline, and extract matched text with visual proof via zoomed screenshots. The implementation is clean, user-focused, and production-ready.")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("What Works Well")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Zero-friction user experience: ", bold: true }), new TextRun("Double-click start.bat, upload a PDF, search immediately")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Offline-first architecture: ", bold: true }), new TextRun("All processing happens locally; no data leaves the machine")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Strong search capabilities: ", bold: true }), new TextRun("Case-sensitive matching, whole-word search, regex support")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Visual validation: ", bold: true }), new TextRun("Screenshots of matches with zoom and padding controls")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Smart HTML/CSS: ", bold: true }), new TextRun("Responsive design, accessible forms, professional UI")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "CSV export: ", bold: true }), new TextRun("Users can export results for further analysis")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // ARCHITECTURE & DESIGN
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Architecture & Design")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Overall Structure")]
      }),
      new Paragraph({
        children: [new TextRun("Your app uses a simple three-tier model:")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Backend (Flask): ", bold: true }), new TextRun("PDF parsing, search logic, screenshot generation")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Frontend (HTML/JS): ", bold: true }), new TextRun("Upload, search configuration, results display")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "In-memory sessions: ", bold: true }), new TextRun("Fast re-searches without disk I/O")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // SESSION MANAGEMENT
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Session Management")]
      }),
      new Paragraph({
        children: [new TextRun("Session design is pragmatic. PDFs are held in memory (via PyMuPDF doc objects), keyed by UUID. Auto-cleanup after 30 minutes prevents memory bloat.")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("✓ Strengths")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Fast: re-searching the same PDF is instant")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Simple: no database needed")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Safe: 30-minute TTL prevents memory leaks")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("⚠ Considerations")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("In-memory storage: multiple large PDFs will consume RAM. For a single non-technical user on a modern laptop (8+ GB), this is fine. If you scale to 10+ concurrent users, consider a hybrid approach (cache most-recent 2–3 PDFs, reload older ones on demand).")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Session ID in client: not a security issue for a local-only app, but if exposed to untrusted networks, add an HTTPS layer and randomize session IDs harder.")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // SEARCH LOGIC
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Search Logic & Text Extraction")]
      }),
      new Paragraph({
        children: [new TextRun("This is the heart of your app. You support three search modes:")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "Simple substring (fast, case-insensitive via PyMuPDF&#x2019;s search_for())", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "Whole-word matching (filters results through regex)", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "Regex (full pattern matching)", bold: true })]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("✓ What Works")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Fallback strategy: for case-sensitive searches, you use words-based extraction instead of relying on PyMuPDF&#x2019;s always-insensitive search_for()")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Regex support: open door to advanced users (invoice patterns, phone numbers, etc.)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Word-based positioning: Using page.get_text(&#x2019;words&#x2019;) gives bounding boxes, which is the correct approach for pinpointing matches")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("⚠ Issues & Improvements")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "Word boundary detection is imperfect for case-sensitive multi-word phrases", bold: true })]
      }),
      new Paragraph({
        children: [
          new TextRun("In _match_substring_case_sensitive(), you build a space-separated phrase and search it. The word boundary logic assumes spaces are delimiters. If a PDF has odd punctuation or line breaks between words, the regex pattern "),
          new TextRun({ text: "r&#x2019;(?<![^\\s])", italic: true }),
          new TextRun(" may fail."),
        ],
        spacing: { after: 120 }
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "Regex character mapping is fragile", bold: true })]
      }),
      new Paragraph({
        children: [
          new TextRun("In _match_regex_to_rects(), you try to find the regex match span in the text, then map it to words. The code does:"),
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "word_start = all_text.find(w[4], pos)", italic: true })
        ],
        spacing: { before: 40, after: 40 }
      }),
      new Paragraph({
        children: [
          new TextRun("This assumes words appear in order and are findable via string.find(). Two edge cases:"),
        ]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 1 },
        children: [new TextRun("Duplicate words: if the page has &#x201C;the&#x201D; multiple times, find() may match the wrong occurrence")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 1 },
        children: [new TextRun("Encoding: PDFs sometimes embed text with ligatures (fi, fl) or Unicode variation selectors that don&#x2019;t match the word extraction")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Recommendations")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Add a fallback for multi-word phrases: ", bold: true }), new TextRun("If your phrase-search fails, fall back to searching for the first word, then validate the rest manually")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Cache character-to-word mappings: ", bold: true }), new TextRun("Pre-compute all word offsets in all_text at page load, not at search time, to catch edge cases early")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Log problematic PDFs: ", bold: true }), new TextRun("If a user reports &#x201C;search didn&#x2019;t find what I know is there,&#x201D; offer them a debug export showing what text PyMuPDF extracted")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // SCREENSHOT RENDERING
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Screenshot Rendering")]
      }),
      new Paragraph({
        children: [new TextRun("Your _render_screenshot() function is solid: clip the region around the match, apply zoom, render to PNG, and encode as base64 for the browser.")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("✓ Strengths")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Configurable zoom and padding let users tailor visual context")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Base64 encoding avoids temp file I/O and security headaches")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Boundary checks prevent off-page clips")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("⚠ Observations")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Memory: each screenshot is base64-encoded in the JSON response. A zoomed image can be 50–150 KB. If you render 100 matches, that&#x2019;s 5–15 MB per search. Modern browsers handle this, but be aware.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Lazy loading: your HTML uses loading=&#x201C;lazy&#x201D;, which is great for long result lists")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // FRONTEND DESIGN
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Frontend Design & UX")]
      }),
      new Paragraph({
        children: [new TextRun("Your HTML is polished and approachable.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Responsive layout: ", bold: true }), new TextRun("Adapts gracefully to mobile (though for PDFs, desktop is primary)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Clear three-step flow: ", bold: true }), new TextRun("Upload → Search → Results")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Color-coded feedback: ", bold: true }), new TextRun("Green for success, red for errors, yellow for loading")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Inline help text: ", bold: true }), new TextRun("Hints for regex, zoom level, page range")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Suggestions for Enhancement")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Add keyboard shortcuts: ", bold: true }), new TextRun("Ctrl+F to focus the search box; Ctrl+E to export (you already handle Enter for search)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Progress bar: ", bold: true }), new TextRun("For very large PDFs (100+ pages), add a &#x201C;Searching page 5 of 100...&#x201D; indicator")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Favorite searches: ", bold: true }), new TextRun("Save search configs to localStorage for repeated tasks")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Drag-and-drop reorder results: ", bold: true }), new TextRun("Let users sort by page, extracted text, or rect size")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // SECURITY & PRIVACY
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Security & Privacy")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("What You Got Right")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Localhost-only by default (127.0.0.1): no remote access")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("No network I/O: PDFs stay on-device")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Files stored in a temp uploads/ folder: easy to clear manually")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Regex error handling: you safely catch re.error and return it to the user")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Minor Recommendations")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "File upload limits: ", bold: true }), new TextRun("You set MAX_CONTENT_LENGTH to 1 GB, which is good. For truly non-technical users, warn them if a file is > 500 MB (slower searches).")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Disable autocomplete on search: ", bold: true }), new TextRun("add autocomplete=&#x201D;off&#x201D; to the search input to prevent leaking previous queries")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Session cleanup robustness: ", bold: true }), new TextRun("Consider renaming uploaded PDFs to a hashed name (e.g., SHA256(session_id) + \".pdf\") instead of session_id directly, in case filesystem permissions are misconfigured")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // TESTING & ROBUSTNESS
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Testing & Robustness")]
      }),
      new Paragraph({
        children: [new TextRun("I see you have test_e2e.py and debug scripts. Good instinct. Here&#x2019;s what you should expand:")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Unit tests for search functions: ", bold: true }), new TextRun("Test _match_substring_case_sensitive(), _match_regex_to_rects() with known PDFs (you have create_test_pdf.py—perfect)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Edge cases: ", bold: true }), new TextRun("Empty PDFs, single-page PDFs, PDFs with no searchable text, multi-line matches")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Load testing: ", bold: true }), new TextRun("Search a 1000-page PDF to ensure memory doesn&#x2019;t balloon")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Crash recovery: ", bold: true }), new TextRun("If the app crashes mid-search, can a user re-upload and try again? (Likely yes, but test it)")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // DEPLOYMENT & OPERATIONS
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Deployment & Operations")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Launch Experience")]
      }),
      new Paragraph({
        children: [new TextRun("Your start.bat / start.sh approach is excellent. Double-click and go. The app auto-opens the browser (webbrowser.open()). Clean.")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Minor Improvements")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Port conflicts: ", bold: true }), new TextRun("If port 8080 is in use, find an alternate port. Add logic: try 8080, then 8081, 8082, etc. Then tell the user which port opened.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Graceful shutdown: ", bold: true }), new TextRun("Pressing Ctrl+C should clean up sessions and temp files. Add a signal handler.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Logging: ", bold: true }), new TextRun("Log searches (search term, results count, time taken) to a local file for future debugging. Don&#x2019;t log the PDF content itself.")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // FEATURE IDEAS
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Feature Ideas for Future Versions")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Search history: Save recent searches (no file I/O, just session state) for quick re-runs")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Batch mode: Upload 3–5 PDFs, run the same search across all, combine results")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Field extraction templates: &#x201C;Invoice Template&#x201D; pre-fills search terms (Invoice #, Date, Total) and exports to a table")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Annotation export: Overlay search results on a copy of the PDF (highlight regions)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("OCR fallback: If text extraction yields nothing, use Tesseract to OCR scanned PDFs")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // CODE QUALITY
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Code Quality & Style")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Strengths")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Clear function names and docstrings")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Separated concerns: search logic, rendering, routing")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Error handling on file uploads and JSON parsing")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Suggested Refactorings")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "Extract search functions into a separate module (search.py)", bold: true })]
      }),
      new Paragraph({
        children: [
          new TextRun("app.py is 410 lines. Consider:"),
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun("- search.py: _match_substring_case_sensitive(), _match_regex_to_rects(), _search_page_words()"),
        ],
        spacing: { before: 40, after: 40 }
      }),
      new Paragraph({
        children: [
          new TextRun("- render.py: _render_screenshot()"),
        ],
        spacing: { before: 40, after: 40 }
      }),
      new Paragraph({
        children: [
          new TextRun("- This keeps app.py focused on Flask routing and session management"),
        ],
        spacing: { before: 40, after: 120 }
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "Type hints", bold: true })]
      }),
      new Paragraph({
        children: [
          new TextRun("Add type hints to function signatures for clarity and IDE support:"),
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "def _search_page_words(page: fitz.Page, search_text: str, ...) -> Tuple[List[fitz.Rect], Optional[str]]:", italic: true })
        ],
        spacing: { before: 40, after: 120 }
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "Configuration file", bold: true })]
      }),
      new Paragraph({
        children: [
          new TextRun("Replace hardcoded values (1 GB limit, 30-min TTL, port 8080) with a config.yaml or .env file for easy customization"),
        ],
        spacing: { after: 120 }
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // FINAL RECOMMENDATIONS
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Final Recommendations & Priorities")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Ship as-is? YES")]
      }),
      new Paragraph({
        children: [new TextRun("Your app is solid. A non-technical user can download it today, run it, and be productive in minutes.")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Quick wins (low effort, high value)")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Add a &#x201C;Clear search&#x201D; button to reset results without re-uploading")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Log warnings if a PDF has 0 searchable text (scanned PDF without OCR)")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Show file size and page count immediately after upload for user confidence")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Add a &#x201C;Help&#x201D; modal with keyboard shortcuts and regex examples")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Planned improvements (next phase)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Unit tests for search edge cases")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Graceful degradation for scanned PDFs (suggest Tesseract OCR)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Multi-PDF batch mode")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Configurable search field templates")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 240 }
      }),

      // CONCLUSION
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Conclusion")]
      }),
      new Paragraph({
        children: [new TextRun("You&#x2019;ve built a focused, user-centric tool that solves a real problem. The offline-first design, clean UX, and solid search logic make this a strong foundation. The minor issues noted (regex character mapping edge cases, multi-word phrase handling) are real but not critical—they appear only in fringe scenarios and are easily addressed if users report them.")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun("My advice: Ship it. Get it in front of users. Their feedback on real-world PDFs will tell you where to invest next.")]
      }),
      new Paragraph({
        text: "",
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Grade: A–", bold: true }),
          new TextRun(" — production-ready with clear paths for enhancement")
        ]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/keen-zen-cerf/mnt/PDF-Extract-and-Screenshot/CODE_REVIEW.docx", buffer);
  console.log("✓ CODE_REVIEW.docx created");
});
