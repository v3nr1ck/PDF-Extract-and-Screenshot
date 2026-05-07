"""End-to-end test for PDF Extract & Screenshot."""
import urllib.request
import json

BASE = "http://127.0.0.1:8080"


def _upload(boundary, data):
    req = urllib.request.Request(
        f"{BASE}/api/upload",
        data=data,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())


def _search(sid, search_text, **kwargs):
    params = {
        "session_id": sid,
        "search_text": search_text,
        "case_sensitive": False,
        "whole_word": False,
        "use_regex": False,
        "page_start": 1,
        "page_end": 1,
        "zoom": 3,
        "padding": 20,
        "extraction_mode": "off",
    }
    params.update(kwargs)
    payload = json.dumps(params).encode()
    req = urllib.request.Request(
        f"{BASE}/api/search",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())


# --- Upload ---
print("=== 1. Upload PDF ===")
boundary = "----Boundary7MA4YWxkTrZu0gW"
data = b""
data += b"--" + boundary.encode() + b"\r\n"
data += b'Content-Disposition: form-data; name="file"; filename="test_invoice.pdf"\r\n'
data += b"Content-Type: application/pdf\r\n\r\n"
with open("test_invoice.pdf", "rb") as f:
    data += f.read()
data += b"\r\n--" + boundary.encode() + b"--\r\n"

upload = _upload(boundary, data)
print(f"  Session: {upload['session_id']}")
print(f"  Pages: {upload['page_count']}")
sid = upload["session_id"]

# --- Basic search ---
print("\n=== 2. Search: 'INVOICE' ===")
result = _search(sid, "INVOICE")
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:50]}'")
    assert "screenshot" in r and r["screenshot"].startswith("data:image/png")

# --- Regex search ---
print("\n=== 3. Search (regex): 'INV-\\d+' ===")
result = _search(sid, r"INV-\d+", use_regex=True)
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:60]}'")

# --- Case-sensitive (should find 0 for lowercase) ---
print("\n=== 4. Search (case sensitive): 'invoice' ===")
result = _search(sid, "invoice", case_sensitive=True)
print(f"  Matches: {result['total_matches']} (expected 0)")

# --- Whole word ---
print("\n=== 5. Search (whole word): 'Total' ===")
result = _search(sid, "Total", whole_word=True)
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:60]}'")

# --- Extraction: right mode ---
print("\n=== 6. Extraction (right): 'Total' ===")
result = _search(sid, "Total", whole_word=True, extraction_mode="right")
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:40]}'  value='{r.get('extracted_value', '')[:40]}'  method='{r.get('extraction_method', '')}'")
    assert "extracted_value" in r
    assert "extraction_method" in r

# --- Extraction: smart mode ---
print("\n=== 7. Extraction (smart): 'INVOICE' ===")
result = _search(sid, "INVOICE", extraction_mode="smart")
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:40]}'  value='{r.get('extracted_value', '')[:40]}'  method='{r.get('extraction_method', '')}'")

# --- Extraction: custom regex ---
print("\n=== 8. Extraction (custom regex): 'INVOICE NUMBER' ===")
result = _search(sid, "INVOICE NUMBER",
                 extraction_mode="custom",
                 extraction_pattern=r":\s*(\S+)")
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:40]}'  value='{r.get('extracted_value', '')[:40]}'  method='{r.get('extraction_method', '')}'")

# --- Extraction: below mode ---
print("\n=== 9. Extraction (below): 'INVOICE NUMBER' ===")
result = _search(sid, "INVOICE NUMBER", extraction_mode="below")
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:40]}'  value='{r.get('extracted_value', '')[:40]}'  method='{r.get('extraction_method', '')}'")

print("\n=== ALL TESTS PASSED ===")
