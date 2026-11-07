# Project 03: Resume Builder (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## Overview
Live client-side A4 Resume Builder with instant live preview. Your confidential resume data stays strictly on your local device.

## Key Features
- **3 Distinct Professional Templates:** Modern Clean, Executive Two-Column, and Minimalist Technical.
- **Interactive Drag & Drop Section Reordering:** Reorder Experience, Education, Projects, Skills, and Summary.
- **A4 Multi-Page Engine:** Strict CSS pagination rules prevent headers or list items from being cut mid-line.
- **Native Selectable Vector Text PDF:** Generates crisp, copyable vector text PDFs (not fuzzy bitmap captures).
- **JSON Backup & Restore:** Export complete resume state to `.json` and restore anytime.

## Execution & Setup
Open `index.html` directly in any browser:
```bash
python3 -m http.server 8080
```
Navigate to `http://localhost:8080/project-03-resume-builder/`.

## Verification & Acceptance Criteria
- [x] Long resume breaks cleanly across 2 pages without cutting any sentence in half.
- [x] Text in exported PDF can be selected, searched, and copied into a word processor.
- [x] Saving data to file and restoring recreates every field and section order exactly.
- [x] Works 100% offline with zero external network requests.
