# Project 1: PDF Studio (Tough)
**Bharat Space Education Research Centre · GenAI Internship**

- **Prompt 1.1 (Architecture & UI Shell)**:
  "Build an offline-first, client-side PDF Studio application running purely in the browser. Must include 29 tools categorized into 5 functional groups:
   1. Organise: Merge, Split, Reorder, Rotate, Delete, Duplicate, Extract Pages, Insert Blank Page, Crop.
   2. Edit: Add Text, Add Image, Highlight, Draw, Shapes, Whiteout, Redact (true permanent pixel removal preventing search/selection), Sign, Fill Forms.
   3. Stamp: Watermark, Page Numbers, Header and Footer, Date Stamp.
   4. Convert: Images to PDF, PDF to Images (PNG/JPG ZIP), PDF to Text (.txt).
   5. Finish: Compress (with before/after byte calculator), Edit Details (metadata: Title, Author, Subject, Keywords), Remove Details (metadata stripper), Compare Two PDFs (visual diff).
   Bonus/Go Further: Password lock / Encryption and Client-side OCR for scanned documents.
   Zero network calls, completely operational with Wi-Fi disconnected."
- **Prompt 1.2 (Core Engine & PDF Rendering)**:
  "Integrate PDF-Lib and PDF.js to load, render, edit, and export PDFs in-memory with thumbnail sidebar, multi-page canvas view, interactive drawing/annotation overlays, and robust file saving."
- **Prompt 1.3 (Verification & Edge Cases)**:
  "Verify with a 50-page document, verify that redacted text cannot be copied or found by search, ensure compression calculates before and after sizes accurately."
