# Project 11: Circle to Fix (Tough)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## Overview
A Manifest V3 Chrome Extension visual bug reporter for AI coding assistants. Circle any UI defect on a webpage and get an instant, ready-to-paste debugging prompt.

## Key Features
- **Global Shortcut Trigger:** Press `Alt+Shift+C` (or click toolbar icon) to activate a full-screen drawing canvas.
- **Annotation Tools:** Freehand circle/highlight, rectangle bounding box, and pointer arrow.
- **Automatic DOM Element Inspector:** Locates the exact DOM element under the drawing center, retrieving its tag, classes, unique CSS selector, and outerHTML snippet.
- **Prompt Generator:** Packages screenshot, element markup, coordinates, and developer notes into a comprehensive prompt.

## Execution & Setup
- **Web Testbed:** Open `index.html` directly in any browser to simulate drawing, DOM inspection, and prompt generation.
- **Chrome Extension:** Load this folder in `chrome://extensions/` using "Load unpacked".

## Verification & Acceptance Criteria
- [x] `Alt+Shift+C` shortcut triggers full-screen drawing canvas cleanly.
- [x] Automatically retrieves DOM selector and code snippet of the circled element.
- [x] Generates clean, ready-to-paste AI agent prompt bundling markup and defect notes.
