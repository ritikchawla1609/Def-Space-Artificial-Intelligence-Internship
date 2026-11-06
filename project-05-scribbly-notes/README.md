# Project 05: Scribbly Notes (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## 🎯 Overview
Transforms typed plain text notes into realistic, human hand-drawn notebook pages ready to print or save.

## 🛠️ Key Features
- **3 Authentic Handwriting Styles:** Architect Script, Flowing Cursive, Casual Blue Ink.
- **Natural Human Variation Algorithm:** Procedural jitter for letter rotation (-2° to +2°), baseline bounce, and pen pressure variance.
- **4 Paper Styles & 4 Ink Colors:** Lined/Ruled, Engineering Graph, Dot Grid, Vintage Sepia; Royal Blue, Gel Black, Crimson Red, Forest Green.
- **Clean Multi-Page Flow:** Word-boundary pagination algorithm ensures lines are never sliced in half.
- **High-Res Export:** Save as high-resolution PNG or multi-page PDF.

## 🚀 How to Run
Open `index.html` directly in any browser:
```bash
python3 -m http.server 8080
```
Navigate to `http://localhost:8080/project-05-scribbly-notes/`.

## ✅ "Done When" Verification
- [x] A 3-page typed note splits into pages with zero lines cut in half.
- [x] Fonts and rendering logic are bundled locally and operate with Wi-Fi off.
- [x] Exported notebook page looks authentic with natural ink imperfections and ruled margins.
