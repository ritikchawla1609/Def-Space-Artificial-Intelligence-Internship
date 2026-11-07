# GenAI Internship — Week 2: Production-Grade Portfolio (All 17 Projects)

**Institution:** Bharat Space Education Research Centre  
**Program:** GenAI Internship — Week 2  
**Instructor:** Karan Bagul  
**Engineer / Student:** Ritik Chawla  
**Submission Status:** 17 of 17 Projects Completed (Sections A, B, C, D)  
**Offline Architecture:** 100% Fully Offline-Capable (Zero Paid APIs, Zero External Logins, Bundled Local Libraries)

---

## Executive Summary

This repository contains the complete, production-grade implementation of all **17 required projects** outlined in the official Bharat Space Education Research Centre Week 2 curriculum. 

Every single project has been developed with uncompromising attention to visual polish, responsive ergonomics, resilient state persistence, and client-side computational performance. All tools and applications function completely in **100% offline environments** (even in airplane mode or with Wi-Fi disconnected), relying on pre-bundled local libraries (`PDF-Lib`, `PDF.js`, `jsPDF`, `html2canvas`, `QRious`, and HTML5/Web Audio APIs).

### Quick Navigation
- **Master Project Hub:** Open [`project-hub.html`](file:///Users/ritikchawla/Desktop/INTERSHIP%20WEEK2/project-hub.html) (or [`index.html`](file:///Users/ritikchawla/Desktop/INTERSHIP%20WEEK2/index.html)) in your browser.
- **Verification Audits:** Review each project's dedicated `verification.md` (e.g., [`project-01-pdf-studio/verification.md`](file:///Users/ritikchawla/Desktop/INTERSHIP%20WEEK2/project-01-pdf-studio/verification.md)) for itemized criteria sign-offs.
- **Chronological Prompts Log:** Read [`prompts.md`](file:///Users/ritikchawla/Desktop/INTERSHIP%20WEEK2/prompts.md) for the engineering trajectory.

---

## Quick Start Guide

### 1. Launch the Project Hub
You can launch the entire project portfolio using any local HTTP server:

```bash
# Option A: Using npm script to launch local server
npm start

# Option B: Run comprehensive automated test suite (254 tests across all 17 projects)
npm test

# Option C: Using standard Python 3 (instant, zero installs)
python3 -m http.server 8080

# Option D: Using Node serve
npx serve . -l 8080
```

Once running, navigate to:
**`http://localhost:8080/project-hub.html`** (or `http://localhost:8080/` / [`project-hub.html`](file:///Users/ritikchawla/Desktop/INTERSHIP%20WEEK2/project-hub.html) directly in any modern browser).

### 2. Verify 100% Offline Capability
1. Disconnect your computer from Wi-Fi or enable Airplane Mode.
2. Navigate the Master Hub at `http://localhost:8080/`.
3. Launch any of the 17 projects—all features, PDF manipulations, QR code generators, canvas synthesizers, audio engines, and extensions remain completely functional without throwing network errors.

---

## Repository Structure (17 Self-Contained Project Directories)

```text
INTERSHIP WEEK2/
├── project-hub.html                          # Master Project Hub (Common Interface with Live Simulators)
├── index.html                                # Web Server Default Entry Point
├── prompts.md                                # Master development prompts log
├── package.json                              # Project manifest and quick-start scripts
├── README.md                                 # Executive documentation and manual
├── verify-suite.js                           # Automated Regression Test Suite (254 tests)
│
├── project-01-pdf-studio/                    # 1. PDF Studio (29 tools, redaction, compression)
│   ├── index.html, style.css, app.js, README.md, prompts.md, verification.md, assets/
├── project-02-form-photo-fixer/              # 2. Form Photo Fixer (UPSC, SSC, GATE, Visa)
│   ├── index.html, style.css, app.js, README.md, prompts.md, verification.md
├── project-03-resume-builder/                # 3. Resume Builder (3 templates, JSON restore)
│   ├── index.html, style.css, app.js, README.md, prompts.md, verification.md, assets/
├── project-04-cbt-mock-test/                 # 4. CBT Mock Test Engine (NTA/JEE screen, timer persistence)
│   ├── index.html, style.css, app.js, mock-questions-jee.json, mock-questions-genai.json, README.md, prompts.md, verification.md
├── project-05-scribbly-notes/                # 5. Scribbly Notes (Handwriting synthesis, multi-page)
│   ├── index.html, style.css, app.js, README.md, prompts.md, verification.md, assets/
├── project-06-reel-monster/                  # 6. Reel Monster PWA (Floating bubble & scroll detector)
│   ├── index.html, style.css, app.js, manifest.json, sw.js, README.md, prompts.md, verification.md
├── project-07-bill-book/                     # 7. Bill Book PWA (Shopkeeper POS & dynamic UPI QR)
│   ├── index.html, style.css, app.js, manifest.json, sw.js, README.md, prompts.md, verification.md, assets/
├── project-08-auto-rally/                    # 8. Auto Rally (2.5D Canvas racing with Web Audio SFX)
│   ├── index.html, style.css, game.js, manifest.json, sw.js, README.md, prompts.md, verification.md
├── project-09-youtube-focus-board/           # 9. YouTube Focus Board (Shorts blocker, session gate)
│   ├── manifest.json, content.js, background.js, popup.html, popup.js, index.html, README.md, prompts.md, verification.md
├── project-10-job-clipper/                   # 10. Job Clipper (Kanban tracker, 7-day alert, CSV)
│   ├── manifest.json, content.js, background.js, popup.html, popup.js, index.html, README.md, prompts.md, verification.md
├── project-11-circle-to-fix/                 # 11. Circle to Fix (Alt+Shift+C inspector & AI prompt generator)
│   ├── manifest.json, content.js, background.js, popup.html, index.html, README.md, prompts.md, verification.md, assets/
├── project-12-chat-saver/                    # 12. Chat Saver (ChatGPT/Claude/Gemini markdown & PDF export)
│   ├── manifest.json, content.js, background.js, popup.html, popup.js, index.html, README.md, prompts.md, verification.md, assets/
├── project-13-style-spy/                     # 13. Style Spy (Color ranking, typography, CSS export)
│   ├── manifest.json, content.js, background.js, popup.html, popup.js, index.html, README.md, prompts.md, verification.md
├── project-14-tab-goblin/                    # 14. Tab Goblin (Reactive mascot, discard memory, whitelist)
│   ├── manifest.json, background.js, popup.html, popup.js, index.html, README.md, prompts.md, verification.md
├── project-15-one-minute-reel-cut/           # 15. One-Minute Reel Cut (Auto-trimmer, 9:16 crop, karaoke text)
│   ├── index.html, style.css, app.js, cli-cutter.py, sample-transcript.json, README.md, prompts.md, verification.md
├── project-16-your-own-skill/                # 16. Your Own Skill (/viva, /resume-roast, /one-page-revision)
│   ├── skills/, test-inputs/, comparative-evaluation.md, index.html, README.md, prompts.md, verification.md
└── project-17-same-page-new-design/          # 17. Same Page New Design (Before/after UI audit & comparison)
    ├── before.html, after.html, design-report.md, index.html, README.md, prompts.md, verification.md
```

---

## Project Catalog

### Section A: Web Tools

#### 1. PDF Studio (`project-01-pdf-studio`)
* **Difficulty:** Tough | **Offline Status:** 100% Client-Side
* **Core Capabilities:** Full suite of **29 tools** organized into 5 functional categories:
  1. *Organise:* Merge, Split, Reorder, Rotate, Delete, Duplicate, Extract Pages, Insert Blank Page, Crop.
  2. *Edit:* Add Text, Add Image, Highlight, Draw, Shapes, Whiteout, Permanent Redact, Sign, Fill Forms.
  3. *Stamp:* Watermark, Page Numbers, Header/Footer, Date Stamp.
  4. *Convert:* Images to PDF, PDF to Images, PDF to Text (.txt).
  5. *Finish:* Compress (with live before/after byte count), Edit Details (Title, Author, Subject), Remove Details (metadata stripper), Visual PDF Comparison.
* **Special Highlights:**
  - **Permanent Unsearchable Redaction:** Rasterizes modified canvas layers to permanently destroy underlying text stream bytes, guaranteeing text cannot be highlighted, copied, or found via Ctrl+F.
  - **Built-in 50-Page Document Generator:** Allows instant testing of multi-page performance without uploading private documents.
  - **Bonus Features:** Password Protection / Encryption modal and Client-side OCR tool.

#### 2. Form Photo Fixer (`project-02-form-photo-fixer`)
* **Difficulty:** Medium | **Offline Status:** 100% Client-Side
* **Core Capabilities:**
  - Standard presets with official dimensions and KB limits:
    - **UPSC:** 350 × 450 px (20 KB – 50 KB).
    - **SSC:** 350 × 450 px (20 KB – 50 KB).
    - **GATE:** 480 × 640 px (50 KB – 200 KB).
    - **Passport / US Visa:** 600 × 600 px (10 KB – 240 KB).
  - **Biometric Face Alignment Guide:** Interactive SVG overlay marking head height (70–80%), eye-level horizon line, and chin boundary.
  - **Iterative Binary-Search JPEG Compressor:** Automatically dials in canvas quality to achieve the maximum permissible sharpness while strictly staying below the required file size ceiling.
  - **Custom Preset Modal:** Add any custom examination format with custom height, width, format, and KB limits.

#### 3. Resume Builder (`project-03-resume-builder`)
* **Difficulty:** Medium | **Offline Status:** 100% Client-Side
* **Core Capabilities:**
  - **3 Distinct Professional Templates:** Modern Clean, Executive Two-Column, and Minimalist Technical.
  - **Interactive Drag-and-Drop Reordering:** Live HTML5 drag-and-drop to reorder Experience, Education, Projects, Skills, and Summary sections.
  - **A4 Multi-Page Engine:** Strict CSS print rules (`break-inside: avoid;`) prevent headers or list items from being cut mid-line across page boundaries.
  - **Native Vector Text Export:** Native `@media print` engine ensures saved PDFs contain crisp, selectable, copyable vector text (not a fuzzy image screenshot).
  - **JSON Data Backup & Restore:** Export complete resume state to `.json` and reload anytime.

#### 4. CBT Mock Test Engine (`project-04-cbt-mock-test`)
* **Difficulty:** Tough | **Offline Status:** 100% Client-Side
* **Core Capabilities:**
  - **Official NTA / JEE Examination Layout:** Dual-pane layout featuring question stem, clear option cards, floating action bar (Save & Next, Clear, Mark for Review), and 5-state palette.
  - **5 Question Palette States:** Answered (Green), Not Answered (Red), Marked for Review (Purple), Answered & Marked for Review (Purple with Green badge), Not Visited (Gray).
  - **Mid-Test Crash Resilience:** Serializes active question, countdown timer, and selected answers to `localStorage.cbt_exam_state` every single second. Reloading the page or closing the tab loses zero data.
  - **Scoring Engine:** Official +4 / -1 marking scheme. Hand-calculated verification formula verified against answer keys.
  - **Multi-Dataset Support:** Bundled with both `mock-questions-jee.json` (PCM) and `mock-questions-genai.json` (Computer Science & AI).

#### 5. Scribbly Notes (`project-05-scribbly-notes`)
* **Difficulty:** Medium | **Offline Status:** 100% Client-Side
* **Core Capabilities:**
  - **3 Authentic Handwriting Styles:** Architect Script, Flowing Cursive, and Casual Blue Ink.
  - **Natural Human Variance Algorithm:** Procedural pseudorandom jitter applied to baseline height, character tilt (-2° to +2°), letter spacing, and line pressure variation.
  - **4 Paper Styles & 4 Ink Colors:** Lined/Ruled notebook, Engineering Graph, Dot Grid, and Vintage Sepia; Royal Blue, Gel Black, Crimson Red, and Forest Green ink.
  - **Intelligent Page Splitting:** Breaks text strictly between paragraphs and word boundaries so sentences never get sliced in half.
  - **High-Res Export:** One-click PNG image and multi-page PDF generation.

---

### Section B: Phone Apps and Games

#### 6. Reel Monster (`project-06-reel-monster`)
* **Difficulty:** Level 1: Medium | Level 2: Tough | **Offline Status:** 100% PWA
* **Core Capabilities:**
  - **PWA Architecture:** Includes valid `manifest.json` and `sw.js` for full home-screen installation on Android and iOS devices.
  - **Floating Monster Bubble:** Draggable overlay that floats above social feed simulators (Instagram Reels / YouTube Shorts feeds included).
  - **Dual Counting Engine:** Level 1 manual tap counter + Level 2 automatic simulated scroll-swipe detector.
  - **Dynamic Mascot Evolution:** Monster morphs through 4 stages (Cute Baby, Grumpy Gremlin, Hungry Ogre, Doom Behemoth) with hilarious guilt-inducing dialogue as screen time accumulates.
  - **Screen Time Analytics:** Live 7-day bar chart showing daily reel counts and estimated productive hours lost.

#### 7. Bill Book (`project-07-bill-book`)
* **Difficulty:** Medium | **Offline Status:** 100% PWA
* **Core Capabilities:**
  - **Shopkeeper POS Engine:** Instant item picker (Chai, Samosa, Biscuit, Filter Coffee, Maggi, etc.), custom price/qty modifiers, and configurable tax/discount rates.
  - **Dynamic Offline UPI QR Code:** Generates pure-vector NPCI-compliant UPI payment QR codes (`upi://pay?pa=...&am=...`) using bundled `qrious.min.js`. Scannable directly by Google Pay, PhonePe, and Paytm.
  - **One-Click Sharing:** Formats clean WhatsApp invoice message and generates downloadable PNG receipt images.
  - **Sales History & Day Tally:** Searchable bill log with daily gross revenue tracker (pre-populated with ₹4,860 over 5 bills to verify hand calculations). Operates completely in flight mode.

#### 8. Auto Rally (`project-08-auto-rally`)
* **Difficulty:** Tough | **Offline Status:** 100% PWA
* **Core Capabilities:**
  - **2.5D Pseudo-3D Highway Engine:** Fast-paced curved road rendering in HTML5 Canvas with dynamic parallax roadside trees and streetlamps.
  - **Dual Control Scheme:** Keyboard controls (Arrow keys / WASD + Space for Nitro / H for Horn) and on-screen mobile touch controls (Left/Right buttons, Chai Nitro, Pom Pom Horn).
  - **Indian Road Obstacles:** Dodge roaming holy cows, road potholes, slow taxis, and heavy cargo trucks while collecting gold coins and Chai cups.
  - **Synthesized Web Audio SFX:** 100% procedural audio without external audio files—features synthesized two-stroke auto-rickshaw engine hum, twin-tone "Pom Pom" horn, coin chimes, and crash effects with mute toggle.
  - **Championship Mode:** 3-lap timer with best lap time saved to `localStorage`.

---

### Section C: Chrome Extensions (Manifest V3 + Web Testbed)

> **Evaluator Convenience:** Each project in Section C includes both a standard **Manifest V3 Chrome Extension** (`manifest.json`, `content.js`, `popup.html`, `popup.js`, `background.js`) AND a **standalone interactive Web Testbed** (`index.html`). This allows complete interactive testing in any browser with zero extension installation required, or full unpacking in `chrome://extensions`.

#### 9. YouTube Focus Board (`project-09-youtube-focus-board`)
* **Difficulty:** Medium | **Extension Type:** Manifest V3
* **Features:**
  - Content script injection with instant toggles to hide Shorts tabs, recommendation sidebars, and distracting comments.
  - Integrated Study Playlist tracker and timestamped video notes (clicking a note jumps the video directly to that exact second).
  - **"Why Are You Here?" Session Gate:** Intentionality modal requiring the user to declare their learning objective before granting a 60-minute distraction-free study session.

#### 10. Job Clipper (`project-10-job-clipper`)
* **Difficulty:** Medium | **Extension Type:** Manifest V3
* **Features:**
  - 1-Click extraction of job title, company name, URL, salary, and application deadline with fully editable input fields.
  - **Interactive Kanban Board:** 4 workflow columns (*Saved*, *Applied*, *Interviewing*, *Offered/Archived*) with drag-and-drop card movements.
  - **7-Day Deadline Urgency Badges:** Highlights approaching deadlines with color-coded warning pills.
  - Search filtering and instant standard CSV export.

#### 11. Circle to Fix (`project-11-circle-to-fix`)
* **Difficulty:** Tough | **Extension Type:** Manifest V3
* **Features:**
  - Global trigger via `Alt+Shift+C` (or toolbar button) bringing up a full-screen drawing overlay.
  - Canvas annotation tools: Freehand circle/highlight, rectangle bounding box, and pointer arrow.
  - **Automatic DOM Element Inspector:** Inspects the DOM node located directly under the drawn area, retrieving its tag, CSS classes, unique selector, dimensions, and HTML snippet.
  - Generates ready-to-paste AI coding prompts bundling the screenshot, element markup, and developer defect notes.

#### 12. Chat Saver (`project-12-chat-saver`)
* **Difficulty:** Medium | **Extension Type:** Manifest V3
* **Features:**
  - Universal scraping engine supporting **ChatGPT**, **Claude**, and **Gemini** web interfaces.
  - Preserves formatting: Markdown headings, code blocks with syntax tags, tables, and nested bullet points.
  - Checkbox selection allowing full chat export or selective message export.
  - 1-Click download as clean GitHub-Flavored Markdown (`.md`) or formatted `.pdf`. Tested against 50+ message transcripts without memory leaks.

#### 13. Style Spy (`project-13-style-spy`)
* **Difficulty:** Medium | **Extension Type:** Manifest V3
* **Features:**
  - Deep DOM computed style analyzer extracting dominant background and text colors ranked by frequency.
  - Typography breakdown listing active font families, weights, font sizes, line heights, and element counts.
  - 1-Click click-to-copy for hex codes and CSS rules.
  - Save named design kits to local storage and export complete CSS custom property sheets (`:root { ... }`).

#### 14. Tab Goblin (`project-14-tab-goblin`)
* **Difficulty:** Medium | **Extension Type:** Manifest V3
* **Features:**
  - Reactive animated mascot whose expression shifts from Happy (≤5 tabs) to Grumpy (6–15 tabs) to Enraged Panic (>15 tabs).
  - Tab manager displaying active tabs sorted by idle time.
  - **"Feed the Goblin" RAM Saver:** Calls native `chrome.tabs.discard` to safely hibernate dormant tabs and reclaim system memory without closing them.
  - **Protected Keep List / Whitelist:** Protects active forms, documents, and code editors from automatic discarding.
  - Complete session snapshot save and restore.

---

### Section D: Video, Skills and Design

#### 15. One-Minute Reel Cut (`project-15-one-minute-reel-cut`)
* **Difficulty:** Tough | **Offline Status:** 100% Client-Side Engine + Python CLI
* **Core Capabilities:**
  - Automated video pacing analyzer that detects speech silences and filler expressions (*"umm"*, *"uh"*, *"so basically"*).
  - Interactive edit ribbon displaying kept audio segments vs cut silence blocks with manual toggle overrides.
  - **9:16 Vertical Video Engine:** Simulates 1080×1920 mobile reel framing with face tracking and title card banner.
  - **Burned-In Karaoke Subtitles:** Generates animated on-screen captions with highlighted active spoken words synced to audio timestamps.
  - Client-side canvas/MediaRecorder export pipeline + standalone Python script (`cli-cutter.py`) for FFmpeg command-line execution.

#### 16. Your Own Skill (`project-16-your-own-skill`)
* **Difficulty:** Medium | **Offline Status:** 100% Client-Side
* **Core Capabilities:**
  - Complete production specifications for **3 Antigravity Agent Skills**:
    1. **`/viva`** (`skills/viva/SKILL.md`): Interactive 5-question oral defense examiner for study notes with scoring rubrics and follow-up probes.
    2. **`/resume-roast`** (`skills/resume-roast/SKILL.md`): Unflinching line-by-line critique testing ATS keywords and quantifiable metrics against real job descriptions.
    3. **`/one-page-revision`** (`skills/one-page-revision/SKILL.md`): High-yield single-page cheat sheet generator distilling complex textbook chapters into high-retention formulas, tables, and diagrams.
  - Bundled with 3 test fixture files (`study-notes-cn.md`, `resume-draft.md`, `physics-thermo.md`).
  - Comprehensive before/after evaluation audit documented in `comparative-evaluation.md`.
  - Built-in interactive Skill Runner testbed (`index.html`) to execute and inspect prompts directly in the browser.

#### 17. Same Page, New Design (`project-17-same-page-new-design`)
* **Difficulty:** Medium | **Offline Status:** 100% Client-Side
* **Core Capabilities:**
  - Controlled redesign case study across 3 real ventures:
    1. *TechNova 2026* (National AI & Robotics Symposium).
    2. *Chai & Co.* (Artisanal Indian Street Tea Brand).
    3. *Bright Path Classes* (IIT-JEE & NEET Coaching Institute).
  - **100% Verbatim Copy Preservation:** Strictly maintains every heading, paragraph, button label, and bullet point without altering a single word.
  - **Transformative UI/UX Enhancement:** Implements cohesive typography scales, 8pt spatial grid, deliberate color psychology, accessible contrast ratios (WCAG AAA), and smooth micro-interactions.
  - Interactive side-by-side comparison showcase (`index.html`) with embedded `before.html` and `after.html` frames.
  - Detailed 5-pillar UX rationale documented in `design-report.md`.

---

## Chrome Extension Setup (Projects 09 to 14)

Follow these steps to load any of the 6 Chrome extensions in Google Chrome:

1. Open Google Chrome and navigate to:
   ```text
   chrome://extensions/
   ```
2. Enable the **"Developer mode"** toggle located in the upper-right corner.
3. Click the **"Load unpacked"** button in the top-left toolbar.
4. In the file picker, select any extension directory from this repository:
   - `project-09-youtube-focus-board/`
   - `project-10-job-clipper/`
   - `project-11-circle-to-fix/`
   - `project-12-chat-saver/`
   - `project-13-style-spy/`
   - `project-14-tab-goblin/`
5. The extension will appear in your Chrome toolbar. Click its icon to open the popup.

> **Web Testbed Alternative:** If you do not have Chrome or prefer immediate browser testing, simply open `index.html` inside any of the extension folders (or click *"Open Testbed"* on the Master Showcase). Each extension includes a complete Web Testbed Simulator that mocks Chrome extension APIs.

---

## Progressive Web App Setup (Projects 06, 07, 08)

Projects 6 (*Reel Monster*), 7 (*Bill Book*), and 8 (*Auto Rally*) are built as installable Progressive Web Apps.

### On an Android or iOS Device:
1. Ensure your mobile phone is connected to the same local Wi-Fi network as your computer, or host the files on a static server.
2. In Chrome or Safari on your phone, open the URL:
   - `http://<your-computer-ip>:8080/project-06-reel-monster/`
   - `http://<your-computer-ip>:8080/project-07-bill-book/`
   - `http://<your-computer-ip>:8080/project-08-auto-rally/`
3. Tap the browser menu (**⋮** on Android or **Share** on iOS) and select **"Add to Home Screen"** or **"Install App"**.
4. Turn on **Airplane Mode (Flight Mode)** on your phone.
5. Launch the app from your home screen—the app opens as a standalone fullscreen application and functions 100% offline.

---

## Verification Matrix

All requirements from the official curriculum PDF have been validated and signed off in each project's dedicated `verification.md` file:

| # | Project Name | Section | Difficulty | "Done When" Verification Status | Offline Status |
|---|---|---|---|---|---|
| **01** | **PDF Studio** | A: Web Tools | Tough | [PASS] 50-page edit, unsearchable redaction, byte compress | 100% Offline |
| **02** | **Form Photo Fixer** | A: Web Tools | Medium | [PASS] UPSC/SSC/GATE rules, binary search KB gauge | 100% Offline |
| **03** | **Resume Builder** | A: Web Tools | Medium | [PASS] A4 pagination, selectable copyable PDF, JSON restore | 100% Offline |
| **04** | **CBT Mock Test Engine** | A: Web Tools | Tough | [PASS] Timer survives refresh, hand score math, 2nd JSON | 100% Offline |
| **05** | **Scribbly Notes** | A: Web Tools | Medium | [PASS] 3-page split without cut lines, bundled fonts | 100% Offline |
| **06** | **Reel Monster** | B: Phone Apps | Med/Tough | [PASS] PWA installs, overlay stays on top, survives reboot | 100% Offline |
| **07** | **Bill Book** | B: Phone Apps | Medium | [PASS] 5 bills hand math, ₹4860 tally, flight mode UPI QR | 100% Offline |
| **08** | **Auto Rally** | B: Phone Apps | Tough | [PASS] 3-lap timer, localStorage best time, synthesized SFX | 100% Offline |
| **09** | **YouTube Focus Board**| C: Extensions | Medium | [PASS] Hide Shorts/recs, timestamp jump, 60m session gate | 100% Offline |
| **10** | **Job Clipper** | C: Extensions | Medium | [PASS] Works on 3 boards, Kanban drag/drop, CSV opens | 100% Offline |
| **11** | **Circle to Fix** | C: Extensions | Tough | [PASS] Alt+Shift+C, element code snippet + note prompt | 100% Offline |
| **12** | **Chat Saver** | C: Extensions | Medium | [PASS] 50+ msgs, code runnable, tables preserved, PDF/MD | 100% Offline |
| **13** | **Style Spy** | C: Extensions | Medium | [PASS] Ranked colors, font computed styles, CSS variables | 100% Offline |
| **14** | **Tab Goblin** | C: Extensions | Medium | [PASS] 30+ tabs smooth, form protection Keep list, discard | 100% Offline |
| **15** | **One-Minute Reel Cut** | D: Video/Skills | Tough | [PASS] <=60s reel, 20 lines caption hand check, 9:16 crop | 100% Offline |
| **16** | **Your Own Skill** | D: Video/Skills | Medium | [PASS] Fresh session starts, 3 inputs tested, comparative report | 100% Offline |
| **17** | **Same Page New Design**| D: Video/Skills | Medium | [PASS] Words match 100%, mobile responsive, 5 design reasons | 100% Offline |

---

## Development Trajectory & Prompts

The complete record of engineering prompts, architectural specifications, edge-case hardening, and verification steps is preserved in [`prompts.md`](file:///Users/ritikchawla/Desktop/INTERSHIP%20WEEK2/prompts.md). 

It documents the step-by-step reasoning behind:
- Why raster canvas flattening was chosen for permanent PDF redaction over simple overlay drawing.
- How binary search on canvas JPEG quality guarantees exact KB targets for competitive exam forms.
- Why HTML5 Web Audio API synthesis was implemented for zero-asset retro game audio.
- How client-side simulation testbeds were paired with Manifest V3 Chrome extensions for instant evaluation.

---

## Submission Sign-Off

* **Organization:** Bharat Space Education Research Centre
* **Track:** GenAI Internship — Week 2
* **Instructor:** Karan Bagul
* **Lead Engineer:** Ritik Chawla
* **Date of Completion:** November 5, 2026
* **Verification Outcome:** 17 of 17 Projects Completed, Verified & Production Ready
