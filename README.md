# 🐶 PDF Extract & Screenshot

**Search large PDFs offline, extract text, and get zoomed screenshots for visual QA validation.**

Built for non-technical business users. No command-line wizardry required.

---

## ✨ What it does

1. **Upload** a massive PDF (up to 1 GB)
2. **Configure** your search — case sensitive, whole word, regex, page range, zoom level
3. **Search** — finds every match instantly using PyMuPDF
4. **Validate** — each result comes with a **zoomed screenshot** of the exact area + page number
5. **Export** results to CSV if needed

## 🚀 How to run (Windows)

1. **Install Python 3.10+** from [python.org](https://www.python.org/downloads/) — ✅ check *"Add Python to PATH"*
2. **Double-click** `start.bat`
3. First run installs everything automatically (give it a minute)
4. Your browser opens to `http://127.0.0.1:8080`
5. Upload a PDF and start searching!

## 🚀 How to run (Mac / Linux)

```bash
chmod +x start.sh
./start.sh
```

Then open `http://127.0.0.1:8080` in your browser.

## ⚙️ Configuration options

| Option | What it does |
|---|---|
| **Search text** | What to look for (e.g. "Invoice", "Total", "PO-1234") |
| **Case sensitive** | Match case exactly |
| **Whole word only** | Only match whole words, not substrings |
| **Use regex** | Advanced pattern matching (e.g. `INV-\d+`) |
| **Page from / to** | Restrict search to specific pages |
| **Zoom level** | How zoomed-in the screenshot should be (1x–5x) |
| **Padding** | Extra pixels around the match in the screenshot |

## 🧠 How it works

- Uses **PyMuPDF (fitz)** to parse and search PDFs locally — **no internet needed**
- Renders screenshots of matched areas at configurable zoom for visual validation
- All data stays on your machine — 100% offline

## 📁 Project structure

```
PDF-Extract-and-Screenshot/
├── app.py              # Flask web app (the brains)
├── requirements.txt    # Python dependencies
├── start.bat           # Windows launcher — double-click me!
├── start.sh            # Mac/Linux launcher
├── templates/
│   └── index.html      # The web interface
└── uploads/            # Temp storage for uploaded PDFs
```

## 🛠️ Tech stack

- **Python** + **Flask** — lightweight web server
- **PyMuPDF (fitz)** — PDF parsing, text extraction, rendering
- **Pillow** — image processing
- HTML/CSS/JS — clean, responsive frontend

---

*Built by farts 🐶 — your loyal digital puppy.*
