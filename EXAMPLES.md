# Multi-Term Search Examples

## Example 1: Invoice Field Extraction

**Use Case:** Extract Invoice Number, Date, and Total from a 50-page batch of invoices.

**User Action:**
1. Upload invoice PDF
2. In search box, type: `Invoice Number, Date, Total`
3. Set options: Case-sensitive OFF, Whole word ON
4. Click "Search PDF"

**Result:**
```
Found 150 matches across 50 pages

[✓ Invoice Number (50)] [✓ Date (50)] [✓ Total (50)]

Invoice Number results shown:

Page 1: INV-2024-001
Page 1: Invoice #INV-2024-001
Page 2: INV-2024-002
...

[Click "Date" tab to see dates]
[Click "Total" tab to see amounts]

[📥 Export CSV]
```

**CSV Output:**
```
Search Term,Page,Extracted Text,Rect X0,Rect Y0,Rect X1,Rect Y1
Invoice Number,1,INV-2024-001,100.0,200.0,300.0,250.0
Invoice Number,1,Invoice #INV-2024-001,100.0,220.0,400.0,270.0
Invoice Number,2,INV-2024-002,100.0,200.0,300.0,250.0
Date,1,Date: 2024-01-15,500.0,200.0,700.0,250.0
Date,2,Date: 2024-01-16,500.0,200.0,700.0,250.0
Total,1,Total: $1,234.56,800.0,400.0,1000.0,450.0
Total,2,Total: $2,345.67,800.0,400.0,1000.0,450.0
```

**Next Step:** Import CSV into Excel → pivot table → done!

---

## Example 2: QA Validation

**Use Case:** Verify all required signatures are present on contract PDFs.

**User Action:**
1. Upload contract PDF
2. Search: `Authorized Signature, Witness Signature, Date Signed`
3. Settings: Case-sensitive OFF, Whole word ON, Zoom: 4x (to see signatures clearly)
4. Click Search

**Result:**
```
Found 2 matches across 15 pages

[✓ Authorized Signature (1)] [✓ Witness Signature (1)] [⚠️ Date Signed (0)]

Authorized Signature (1 match):
- Page 10: [Screenshot of signature block] "John Smith"

Witness Signature (1 match):
- Page 10: [Screenshot of signature block] "Jane Doe"

Date Signed (0 matches):
⚠️ Missing! Check manually or try different search term.
```

**Action:** Screenshot confirms signatures are present. Flag missing date field for follow-up.

---

## Example 3: Multi-Document Extraction

**Use Case:** Extract key fields from mixed document types (invoices + receipts).

**Upload:** Single PDF with mixed content

**Search:** `Invoice #, Receipt #, PO Number, Total Amount, Reference`

**Result:**
```
[✓ Invoice # (8)] [✓ Receipt # (5)] [⚠️ PO Number (0)] [✓ Total Amount (13)] [✓ Reference (10)]

Invoices identified: 8
Receipts identified: 5
Purchase orders: 0
All have amounts: 13
References complete: 10
```

**Export → Import into database → Auto-categorize documents based on found fields**

---

## Example 4: Regex Multi-Term Search

**Use Case:** Extract structured data using regex patterns.

**Search (Regex ON):** `INV-\d{4}, TOT-\$[\d,]+, DTE-\d{2}/\d{2}/\d{4}`

**Breakdown:**
- `INV-\d{4}` → Invoices like "INV-2024"
- `TOT-\$[\d,]+` → Amounts like "TOT-$1,234.56"
- `DTE-\d{2}/\d{2}/\d{4}` → Dates like "DTE-01/15/2024"

**Result:**
```
[✓ INV-\d{4} (150)] [✓ TOT-\$[\d,]+ (150)] [✓ DTE-\d{2}/\d{2}/\d{4} (150)]

All patterns matched! Ready for structured extraction.
```

---

## Example 5: Field Validation

**Use Case:** Ensure all required document fields are present.

**Checklist:**
```
Search for: Name, Address, Phone, Email, Signature

Upload batch → Search → Results show:
[✓ Name (100)] [✓ Address (98)] [✓ Phone (95)] [⚠️ Email (87)] [✓ Signature (100)]

Analysis:
- 3 docs missing address
- 5 docs missing phone
- 13 docs missing email
- All have signatures ✓

Export → Review flagged documents → Fix or resubmit
```

---

## Performance Notes

### Typical Search Times
- 10-page PDF, 3 search terms: **< 1 second**
- 100-page PDF, 5 search terms: **~3 seconds**
- 1000-page PDF, 10 search terms: **~30 seconds**

### Tips for Speed
- Search whole word only if possible (faster than substring)
- Avoid complex regex patterns if not needed
- Reduce page range if possible (e.g., first 50 pages only)

---

## Real-World Workflow

```
STEP 1: Upload PDF batch
   └─> 500-page PDF with 50 invoices

STEP 2: Search for fields
   └─> "Invoice #, Date, Amount, PO #"

STEP 3: Review results in UI
   └─> Verify screenshots look right
   └─> All 50 invoices found ✓

STEP 4: Export to CSV
   └─> 200 rows (4 fields × 50 invoices)

STEP 5: Import to Excel
   └─> Pivot, sort, analyze
   └─> Ready for accounting system

Total time: ~2 minutes (vs 2 hours manual)
```

---

## Advanced: Combining with Filters

**Scenario:** Extract invoices for a specific customer.

```
Search 1: "Invoice #" → find all invoices
Export → filter for customer

OR

Search 2: "Customer: Acme Corp, Amount:"
→ finds invoices for just that customer
```

Both approaches work. Choose based on document structure!
