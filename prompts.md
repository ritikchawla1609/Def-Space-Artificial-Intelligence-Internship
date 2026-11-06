# GenAI Internship - Week 2: Complete Project Development Prompts Log
**Bharat Space Education Research Centre · GenAI Internship**
**Instructor: Karan Bagul**
**Student / Engineer: Ritik Chawla**
**Scope: All 17 Projects (Sections A, B, C, D) + Master Hub & Test Suite**

---

## Executive Overview
This document logs every prompt, architectural specification, validation criteria, and refinement cycle used to build the complete 17-project portfolio for Week 2. Every single project is engineered for production-grade reliability, 100% offline functionality, and full compliance with the PDF requirements.

---

## Section A: Web Tools

### Project 1: PDF Studio (Tough)
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

### Project 2: Form Photo Fixer (Medium)
- **Prompt 2.1 (Form Requirements & Face Guide)**:
  "Build an offline browser app to prepare applicant photos and signatures for competitive examination forms (UPSC, SSC, GATE, IBPS, Passport, US Visa). Features:
   - Simultaneous or separate upload of passport photo and signature.
   - Built-in presets with exact physical/pixel dimensions, aspect ratio, and maximum KB file size limits.
   - Interactive visual face guide (head oval, eye alignment line, chin boundary) with draggable/zoomable canvas crop.
   - Iterative binary-search JPEG quality compressor that dials in the final file size to just under the required KB limit without blur.
   - Custom preset creator allowing users to define custom width, height, max KB, and format.
   - Real official rules references and one-click download for photo and signature."

### Project 3: Resume Builder (Medium)
- **Prompt 3.1 (A4 Live Engine & Drag-and-Drop)**:
  "Build a local, client-side A4 Resume Builder with live preview:
   - 3 distinct templates: (1) Modern Clean, (2) Executive Two-Column, (3) Minimalist Tech.
   - Drag-and-drop section reordering (Experience, Education, Projects, Skills, Summary, Awards).
   - Multi-page pagination engine ensuring clean page breaks without splitting lines or text mid-paragraph.
   - Native selectable text PDF export via browser print/PDF generation.
   - JSON data backup export and file restore."

### Project 4: CBT Mock Test Engine (Tough)
- **Prompt 4.1 (NTA/JEE/GATE Realistic CBT Exam Interface)**:
  "Build an offline Computer-Based Test (CBT) engine replicating official exam screens:
   - Load questions from JSON or CSV files; provide preloaded comprehensive mock tests (Physics, Chemistry, Math, GenAI & Computer Science).
   - Countdown timer with auto-submission upon expiry.
   - Real question palette with 5 official statuses: Answered, Not Answered, Marked for Review, Answered & Marked for Review, Not Visited.
   - Positive and negative marking schemes (+4, -1 or configurable).
   - Complete state persistence: page reload or browser crash mid-test retains timer and selections via localStorage.
   - Comprehensive result analytics: total score, accuracy %, subject-wise breakdown, and time spent per question."

### Project 5: Scribbly Notes (Medium)
- **Prompt 5.1 (Natural Handwriting Synthesis & Page Flow)**:
  "Build an offline web app that converts typed plain text notes into realistic hand-drawn notebook pages:
   - 3 authentic handwriting styles (Architect Script, Flowing Cursive, Casual Blue Ink).
   - Multiple ink colors (Royal Blue, Gel Black, Crimson Red, Forest Green) and paper styles (Lined/Ruled, Graph/Grid, Dot Grid, Vintage Sepia).
   - Human variation algorithm: realistic subtle jitter in character rotation, baseline bounce, letter spacing, and pen pressure variance.
   - Multi-page text flow engine preventing cut-off sentences.
   - High-resolution image (PNG) and multi-page PDF export."

---

## Section B: Phone Apps and Games

### Project 6: Reel Monster (Level 1: Medium & Level 2: Tough)
- **Prompt 6.1 (Interactive PWA & Floating Overlay Simulator)**:
  "Build 'Reel Monster' as an installable PWA with mobile-first UI:
   - Cute animated monster bubble that floats over social apps (Instagram/YouTube simulator included).
   - Level 1 manual tap counter + Level 2 simulated automatic reel swipe detection.
   - Reactive monster evolution: grows larger, changes facial expressions, and utters hilarious guilty comments as the counter climbs.
   - In-app screen time analytics: reels counted today, estimated hours lost, and interactive 7-day bar chart.
   - 100% offline, persistent storage across device restarts."

### Project 7: Bill Book (Medium)
- **Prompt 7.1 (Shopkeeper Billing & UPI Payment QR)**:
  "Build an offline billing PWA for small business owners:
   - Shop profile customization (Shop name, address, GST, custom UPI ID).
   - Fast item catalog with pre-defined rates, quantity, unit, discount %, and tax (GST) calculation.
   - Instant dynamic UPI QR Code generator encoding exact bill total (`upi://pay?pa=...&am=...`).
   - One-click share: render beautiful receipt image and generate direct WhatsApp message.
   - Daily sales tally, searchable bill history, works completely in flight mode."

### Project 8: Auto Rally (Tough)
- **Prompt 8.1 (Indian Auto-Rickshaw Arcade Racing Game)**:
  "Build a fast-paced HTML5 Canvas auto-rickshaw racing game:
   - Curved looping road engine with dynamic roadside scenery.
   - Dual control schemes: keyboard (WASD / Arrows) and on-screen touch controls (virtual joystick / steer & nitro buttons).
   - Coins to collect, traffic obstacles (cows, potholes, taxis, trucks), and 'Chai Nitro Boost' power-up.
   - 3-lap championship mode with lap split timer and personal best lap time saved to localStorage.
   - Synthesized retro Web Audio SFX (horn 'pom pom', engine rev, coin ping, crash) with mute toggle. Runs 100% offline."

---

## Section C: Chrome Extensions

### Project 9: YouTube Focus Board (Medium)
- **Prompt 9.1 (Distraction-Free Study Extension & Session Gate)**:
  "Build a Manifest V3 Chrome Extension and interactive testbed:
   - Content script toggles to instantly hide Shorts, recommendations, and comments.
   - Integrated Study Playlist tracker and timestamped video notes (click jump to video time).
   - Daily watch-time tracker.
   - 'Why are you here?' intentionality gate requiring a study objective before unlocking a 60-minute session."

### Project 10: Job Clipper (Medium)
- **Prompt 10.1 (Kanban Job Application Tracker & Auto-Clipper)**:
  "Build a Manifest V3 Chrome Extension:
   - One-click metadata extraction from job posting pages (Role, Company, Link, Deadline) with editable fields.
   - Interactive Kanban Board (Saved, Applied, Interview, Offer/Result) with drag-and-drop.
   - Deadline alerts and status badges.
   - Search filter and one-click CSV export."

### Project 11: Circle to Fix (Tough)
- **Prompt 11.1 (Visual Bug Reporter for AI Coding Agents)**:
  "Build a Manifest V3 Chrome Extension:
   - Shortcut trigger (Alt+Shift+C) activating full-screen drawing canvas.
   - Freehand circle, rectangle, and arrow annotation tools.
   - Automatic DOM element detection under drawing center (selector, tag, classes, outerHTML snippet).
   - Canvas screenshot capture.
   - Formatted AI prompt generator bundling element code, coordinates, screenshot, and developer instructions."

### Project 12: Chat Saver (Medium)
- **Prompt 12.1 (Multi-Platform AI Chat Exporter)**:
  "Build a Manifest V3 Chrome Extension supporting ChatGPT, Claude, and Gemini:
   - Smart message scraper distinguishing user prompts from assistant responses.
   - Full conversation export or selective checkbox export.
   - Preserves markdown headers, code blocks with syntax, tables, and lists.
   - One-click clean Markdown (.md) and formatted PDF download. Zero data sent to servers."

### Project 13: Style Spy (Medium)
- **Prompt 13.1 (Page Design & Typography Extractor)**:
  "Build a Manifest V3 Chrome Extension:
   - Analyzes visible DOM computed styles to extract dominant color palettes ranked by frequency.
   - Extracts typography hierarchy (font families, weights, font sizes, line heights).
   - Click-to-copy color hex codes and font definitions.
   - Save named design kits in local storage and export as CSS custom properties (`:root`)."

### Project 14: Tab Goblin (Medium)
- **Prompt 14.1 (Reactive Tab Manager & Memory Saver)**:
  "Build a Manifest V3 Chrome Extension:
   - Live tab counter with reactive animated Goblin mascot whose mood changes according to tab overload.
   - Tabs ranked by idle duration.
   - 'Feed the Goblin' memory optimizer utilizing `chrome.tabs.discard` to suspend idle tabs without closing them.
   - Whitelist / Keep list protecting crucial forms and documents.
   - Complete session backup and restore."

---

## Section D: Video, Skills and Design

### Project 15: One-Minute Reel Cut (Tough)
- **Prompt 15.1 (Automated Video Trimmer & Vertical Reel Generator)**:
  "Build an automated reel cutting engine:
   - Audio analysis module to detect silences and filler phrases ('umm', 'uh', 'so basically').
   - Visual interactive edit plan timeline displaying kept vs cut segments with manual override toggles.
   - 9:16 vertical crop with face-framing simulation.
   - Burned-in animated karaoke subtitles highlighting spoken words.
   - Title card overlay, audio fade-in/out, and client-side rendering pipeline."

### Project 16: Your Own Skill (Medium)
- **Prompt 16.1 (Antigravity Agent Skills Specification & Test Suite)**:
  "Create 3 production-grade agent skills with SKILL.md specifications, prompt templates, and evaluation runners:
   1. `/viva`: Interactive 5-question oral defense examiner for study notes.
   2. `/resume-roast`: Unflinching, line-by-line resume critique against a job description.
   3. `/one-page-revision`: High-yield single-page cheat sheet generator from textbook chapters.
   Include complete test input suites and before/after evaluation comparative logs."

### Project 17: Same Page, New Design (Medium)
- **Prompt 17.1 (Controlled UI/UX Redesign Case Study)**:
  "Construct a before-and-after redesign demonstration for 3 venture pages ('TechNova 2026', 'Chai and Co.', 'Bright Path Classes'):
   - `before.html`: Unstyled, bland, default typography, broken layout.
   - `after.html`: World-class design using modern design system principles, responsive layout, micro-interactions, retaining identical text verbatim.
   - `design-report.md`: Formal UX audit detailing key design improvements and cognitive rationale."

---
