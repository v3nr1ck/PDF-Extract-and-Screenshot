# Multi-Term Search Implementation

## Overview
Your PDF Extract & Screenshot app now supports searching for **multiple terms simultaneously**. Users can enter comma-separated search terms and see results grouped by term.

## What Changed

### Backend (`app.py`)

#### New Function: `_search_single_term()`
- Extracted the search logic into a reusable function
- Searches for a single term across the specified page range
- Returns results and any errors
- Called once per search term

#### Updated `search_pdf()` Route
- **Backward compatible**: Still accepts `search_text` for single searches
- **New feature**: Accepts `search_terms` array for multiple searches
- Parses comma-separated terms from the frontend
- Loops through each term and collects results
- Returns `results_by_term` dictionary keyed by search term

**Request format (multi-term):**
```json
{
  "session_id": "abc123",
  "search_terms": ["Invoice Number", "Total", "Date"],
  "case_sensitive": false,
  "whole_word": true,
  "use_regex": false,
  "page_start": 1,
  "page_end": null,
  "zoom": 3.0,
  "padding": 20,
  "max_per_page": 10
}
```

**Response format:**
```json
{
  "results_by_term": {
    "Invoice Number": {
      "results": [...],
      "match_count": 5
    },
    "Total": {
      "results": [...],
      "match_count": 3
    },
    "Date": {
      "results": [...],
      "match_count": 0
    }
  },
  "total_matches": 8,
  "pages_searched": 10,
  "session_id": "abc123"
}
```

### Frontend (`templates/index.html`)

#### Input Change
- Label updated: "Search for (comma-separated for multiple terms)"
- Placeholder updated with example: "e.g. Invoice Number, Total, Date"
- Helper text: "💡 Enter multiple terms separated by commas to search for all of them at once"

#### New JavaScript Functions

**`doSearch()` (modified)**
- Parses comma-separated input: `"Invoice, Total, Date"` → `["Invoice", "Total", "Date"]`
- Sends `search_terms` array to backend
- Handles both single and multi-term responses

**`renderResults()` (rewritten)**
- Detects multi-term results (from `results_by_term`)
- For single term: displays results as before (backward compatible)
- For multiple terms:
  - Shows tabs for each search term
  - Each tab displays: term name + match count + status (✓ or ⚠️)
  - Click a tab to filter results to that term only
  - Shows "No matches found" with yellow badge for empty terms

**`filterByTerm(term)` (new)**
- Toggles visibility of results for a specific term
- Highlights the active term tab
- Changes tab background/border colors

**`exportResults()` (updated)**
- CSV now includes "Search Term" as first column
- Format: `Search Term, Page, Extracted Text, Rect X0, Y0, X1, Y1`
- All terms' results exported together

#### New Helper
**`escapeHtmlAttr(text)`**
- Safely escapes HTML attributes (quotes, apostrophes)
- Used in data attributes and onclick handlers

## User Experience

### Single Term Search (unchanged)
```
User enters: "Invoice Number"
↓
Backend searches for "Invoice Number"
↓
Shows results as before
```

### Multi-Term Search (new)
```
User enters: "Invoice Number, Total, Date"
↓
Frontend splits → ["Invoice Number", "Total", "Date"]
↓
Backend searches each term, returns grouped results
↓
Frontend displays:
  [✓ Invoice Number (5)] [✓ Total (3)] [⚠️ Date (0)]
  
  "Invoice Number" results shown
  (click tabs to filter)
↓
Export CSV includes all terms
```

## Design Decisions

1. **Comma-separated input**: Simple, intuitive, no new UI elements needed
2. **Grouped results**: Users see which terms matched and how many
3. **Backward compatible**: Old `search_text` requests still work
4. **No database**: All results computed on each search (fast for local PDFs)
5. **Tab filtering**: Quick switching between terms without re-searching
6. **CSV export**: Includes term column for batch field extraction

## Testing Checklist

- [ ] Single term search still works
- [ ] Multi-term search with 2-3 terms works
- [ ] Terms with no matches show ⚠️ badge
- [ ] Tab filtering switches results correctly
- [ ] CSV export includes all terms
- [ ] Edge cases: empty terms, special characters, regex with multiple terms
- [ ] Performance: 50+ match results across 3 terms

## Example Use Cases

### Invoice Extraction
```
Search: "Invoice Number, Date, Total, Amount Due"
↓
Extracts all 4 fields from every page
↓
CSV output ready for spreadsheet
```

### QA Validation
```
Search: "Signature, Approval Date, Reviewer"
↓
Verifies all required signatures present
↓
Screenshots show each location
```

### Batch Processing
```
Upload 1 PDF, search 10 terms at once
↓
See which terms are present/missing
↓
Export for data entry
```

## Notes

- Each search term uses the same options (case sensitivity, whole word, regex)
- If one term has a regex error, entire search fails with error message
- Max results per term respects the `max_per_page` setting
- Session cleanup (30 min TTL) unchanged
