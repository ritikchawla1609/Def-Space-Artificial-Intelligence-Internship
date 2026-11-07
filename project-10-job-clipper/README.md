# Project 10: Job Clipper (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## Overview
A Manifest V3 Chrome Extension that clips job postings from recruitment sites (LinkedIn, Indeed, portals) into an interactive Kanban board with deadline tracking.

## Key Features
- **1-Click Extraction:** Scrapes job title, company name, URL, salary, and deadline into editable input fields.
- **Interactive Kanban Board:** 4 workflow stages (*Saved*, *Applied*, *Interviewing*, *Offered/Archived*) with drag-and-drop card movements.
- **7-Day Deadline Urgency Badges:** Automatic visual alerts when application deadlines are within 7 days.
- **CSV Export:** 1-Click standard CSV export of all clipped applications.

## Execution & Setup
- **Web Testbed:** Open `index.html` directly in any browser to test the full clipping and Kanban workflow.
- **Chrome Extension:** Load this folder in `chrome://extensions/` using "Load unpacked".

## Verification & Acceptance Criteria
- [x] Clips job postings with manual fallback editing if fields are non-standard.
- [x] Interactive Kanban allows effortless drag-and-drop column transitions.
- [x] Exported CSV file opens cleanly in Excel, Google Sheets, or LibreOffice.
