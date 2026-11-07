# Project 13: Style Spy (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## Overview
A Manifest V3 Chrome Extension that extracts computed color palettes, typography hierarchy, and spacing tokens from any live webpage and saves them as a reusable design kit.

## Key Features
- **Dominant Color Palette Analyzer:** Computes background and text colors ranked by frequency of use.
- **Typography Hierarchy Breakdown:** Lists active font families, weights, font sizes, and line heights.
- **Click-to-Copy:** One-click copy for hex color codes and CSS rules.
- **CSS Variable Export:** Saves named design kits and exports them as standard CSS custom property blocks (`:root { ... }`).

## Execution & Setup
- **Web Testbed:** Open `index.html` directly in any browser to inspect simulated websites and extract kits.
- **Chrome Extension:** Load this folder in `chrome://extensions/` using "Load unpacked".

## Verification & Acceptance Criteria
- [x] Computes frequency-ranked color palettes and typography rules.
- [x] Click-to-copy copies valid CSS values to clipboard.
- [x] Exports valid CSS custom properties block ready for inclusion in web stylesheets.
