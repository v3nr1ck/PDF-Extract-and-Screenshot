"""Debug: print all words from test PDF to understand PyMuPDF's word extraction."""
import fitz

doc = fitz.open("test_invoice.pdf")
page = doc[0]
words = page.get_text('words')
print(f"Total 'words' found: {len(words)}")
for i, w in enumerate(words):
    print(f"  [{i}] rect=({w[0]:.0f},{w[1]:.0f},{w[2]:.0f},{w[3]:.0f})  word='{w[4]}'")

print("\n--- Full text ---")
print(repr(page.get_text('text')))
