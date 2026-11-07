# Project 02: Form Photo Fixer (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## Overview
Get passport photos and signatures compliant with government examination forms (UPSC, SSC, GATE, IBPS, Visa) in one step, 100% offline.

## Key Features
- **Official Examination Presets:**
  - UPSC: 350 × 450 px (20 KB – 50 KB)
  - SSC: 350 × 450 px (20 KB – 50 KB)
  - GATE: 480 × 640 px (50 KB – 200 KB)
  - Passport / US Visa: 600 × 600 px (10 KB – 240 KB)
- **Biometric Face Alignment Guide:** Interactive SVG overlay showing head height (70–80%), eye-level horizon line, and chin boundary.
- **Iterative Binary-Search JPEG Compressor:** Automatically tunes canvas compression quality to achieve maximum sharpness while strictly staying below the required KB limit.
- **Custom Preset Modal:** Define custom pixel width, height, format, and max KB limits.

## Execution & Setup
Open `index.html` directly in any browser:
```bash
python3 -m http.server 8080
```
Navigate to `http://localhost:8080/project-02-form-photo-fixer/`.

## Verification & Acceptance Criteria
- [x] Output strictly meets rules of 3 real forms (UPSC, SSC, GATE) with official dimension citations.
- [x] Computer file details confirm compressed file size is strictly under target KB.
- [x] High-resolution camera photos process smoothly without network connection.
