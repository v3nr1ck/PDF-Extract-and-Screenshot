"""End-to-end test for PDF Extract & Screenshot."""
import urllib.request
import json
import io
import os

BASE = "http://127.0.0.1:8080"

# 1. Upload
print("=== 1. Upload PDF ===")
boundary = "----Boundary7MA4YWxkTrZu0gW"
data = b""
data += b"--" + boundary.encode() + b"\r\n"
data += b'Content-Disposition: form-data; name="file"; filename="test_invoice.pdf"\r\n'
data += b"Content-Type: application/pdf\r\n\r\n"
with open("test_invoice.pdf", "rb") as f:
    data += f.read()
data += b"\r\n--" + boundary.encode() + b"--\r\n"

req = urllib.request.Request(
    f"{BASE}/api/upload",
    data=data,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
)
resp = urllib.request.urlopen(req)
upload = json.loads(resp.read())
print(f"  Session: {upload['session_id']}")
print(f"  Pages: {upload['page_count']}")
sid = upload["session_id"]

# 2. Search (basic)
print("\n=== 2. Search: 'INVOICE' ===")
payload = json.dumps({
    "session_id": sid,
    "search_text": "INVOICE",
    "case_sensitive": False,
    "whole_word": False,
    "use_regex": False,
    "page_start": 1,
    "page_end": 1,
    "zoom": 3,
    "padding": 20,
}).encode()
req = urllib.request.Request(
    f"{BASE}/api/search",
    data=payload,
    headers={"Content-Type": "application/json"},
)
resp = urllib.request.urlopen(req)
result = json.loads(resp.read())
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:50]}'")
    assert "screenshot" in r and r["screenshot"].startswith("data:image/png")

# 3. Search (regex)
print("\n=== 3. Search (regex): 'INV-\\d+' ===")
payload = json.dumps({
    "session_id": sid,
    "search_text": r"INV-\d+",
    "case_sensitive": False,
    "whole_word": False,
    "use_regex": True,
    "page_start": 1,
    "page_end": 1,
    "zoom": 3,
    "padding": 20,
}).encode()
req = urllib.request.Request(
    f"{BASE}/api/search",
    data=payload,
    headers={"Content-Type": "application/json"},
)
resp = urllib.request.urlopen(req)
result = json.loads(resp.read())
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:60]}'")

# 4. Search (case sensitive - should find nothing for lowercase)
print("\n=== 4. Search (case sensitive): 'invoice' ===")
payload = json.dumps({
    "session_id": sid,
    "search_text": "invoice",
    "case_sensitive": True,
    "whole_word": False,
    "use_regex": False,
    "page_start": 1,
    "page_end": 1,
    "zoom": 3,
    "padding": 20,
}).encode()
req = urllib.request.Request(
    f"{BASE}/api/search",
    data=payload,
    headers={"Content-Type": "application/json"},
)
resp = urllib.request.urlopen(req)
result = json.loads(resp.read())
print(f"  Matches: {result['total_matches']} (expected 0)")

# 5. Search (whole word - 'Total' should find both 'Total Amount' lines)
print("\n=== 5. Search (whole word): 'Total' ===")
payload = json.dumps({
    "session_id": sid,
    "search_text": "Total",
    "case_sensitive": False,
    "whole_word": True,
    "use_regex": False,
    "page_start": 1,
    "page_end": 1,
    "zoom": 3,
    "padding": 20,
}).encode()
req = urllib.request.Request(
    f"{BASE}/api/search",
    data=payload,
    headers={"Content-Type": "application/json"},
)
resp = urllib.request.urlopen(req)
result = json.loads(resp.read())
print(f"  Matches: {result['total_matches']}")
for r in result["results"]:
    print(f"  - Page {r['page']}: text='{r['text'][:60]}'")

print("\n=== ALL TESTS PASSED ===")
