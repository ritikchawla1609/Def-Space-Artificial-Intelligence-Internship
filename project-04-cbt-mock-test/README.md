# Project 04: CBT Mock Test Engine (Tough)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## 🎯 Overview
Authentic Computer-Based Test (CBT) engine replicating official NTA / JEE / GATE exam interfaces with question navigation, countdown timer, and automated marking.

## 🛠️ Key Features
- **Official Exam Screen Layout:** Split-pane interface with question stem, options, action toolbar, and question palette.
- **5-State Question Palette:** Answered (Green), Not Answered (Red), Marked for Review (Purple), Answered & Marked (Purple+Green), Not Visited (Gray).
- **Crash & Reload Resilience:** Auto-saves remaining time and selected answers to `localStorage` every second.
- **Official Scoring:** Configurable marking scheme (+4 correct, -1 wrong, 0 unattempted).
- **Multi-Test Loading:** Ships with `mock-questions-jee.json` (PCM) and `mock-questions-genai.json` (Computer Science & AI).

## 🚀 How to Run
Open `index.html` directly in any browser:
```bash
python3 -m http.server 8080
```
Navigate to `http://localhost:8080/project-04-cbt-mock-test/`.

## ✅ "Done When" Verification
- [x] Refreshing mid-test loses nothing, including timer seconds and marked statuses.
- [x] Score matches hand calculation for all 15 questions according to the +4 / -1 scheme.
- [x] Loading a second question file (`mock-questions-genai.json`) works without changing a single line of code.
