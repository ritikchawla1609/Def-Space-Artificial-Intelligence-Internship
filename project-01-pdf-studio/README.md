# Project 01: PDF Studio (Tough)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## 🎯 Overview
An offline-first, client-side PDF Studio running entirely in your browser with no file uploads, no user accounts, and no internet connection required.

## 🛠️ Complete Suite of 29 Tools
1. **Organise:** Merge, Split, Reorder, Rotate, Delete, Duplicate, Extract Pages, Insert Blank Page, Crop.
2. **Edit:** Add Text, Add Image, Highlight, Draw, Shapes, Whiteout, Permanent Redact, Sign, Fill Forms.
3. **Stamp:** Watermark, Page Numbers, Header and Footer, Date Stamp.
4. **Convert:** Images to PDF, PDF to Images (PNG/JPG), PDF to Text (.txt).
5. **Finish:** Compress (live before/after byte count), Edit Details (metadata), Remove Details, Compare Two PDFs.
6. **Bonus / Go Further:** Password Lock / Encryption & Client-side OCR.

## 🔒 Permanent Redaction Guarantee
Unlike basic tools that merely draw a black overlay leaving underlying vector text searchable, PDF Studio rasterizes and permanently removes underlying text streams so that redacted text cannot be copied or found via Ctrl+F.

## 🚀 How to Run
Simply open `index.html` in any modern web browser or serve locally:
```bash
python3 -m http.server 8080
```
Then navigate to `http://localhost:8080/project-01-pdf-studio/`.

## ✅ "Done When" Verification
- [x] Edit a 50-page document with Wi-Fi off using tools from all 5 groups (use built-in "Create 50-Page PDF" generator).
- [x] Saved file opens properly in standard PDF readers (Adobe Acrobat, Preview, Chrome).
- [x] Redacted text cannot be selected or found by search afterwards.
- [x] Compress shows exact file size before and after with percentage reduction.
