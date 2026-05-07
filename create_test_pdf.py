"""Create a test PDF for end-to-end testing."""
import fitz

doc = fitz.open()
page = doc.new_page()

page.insert_text((72, 72), "INVOICE NUMBER: INV-2025-0042", fontsize=14)
page.insert_text((72, 120), "Date: 2025-05-07", fontsize=11)
page.insert_text((72, 160), "Client: Acme Corp", fontsize=11)
page.insert_text((72, 200), "Total Amount: $42,000.00", fontsize=14)
page.insert_text((72, 240), "This is some random paragraph text that", fontsize=11)
page.insert_text((72, 260), "should not match our search terms.", fontsize=11)
page.insert_text((72, 320), "PO Number: PO-2025-8821", fontsize=12)
page.insert_text((72, 380), "INVOICE NUMBER: INV-2025-0043", fontsize=14)
page.insert_text((72, 420), "Date: 2025-05-08", fontsize=11)
page.insert_text((72, 460), "Client: Globex Inc", fontsize=11)
page.insert_text((72, 500), "Total Amount: $128,000.00", fontsize=14)

doc.save("test_invoice.pdf")
doc.close()
print("Test PDF created: test_invoice.pdf")
