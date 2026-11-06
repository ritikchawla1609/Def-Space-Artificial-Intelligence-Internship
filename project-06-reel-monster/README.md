# Project 06: Reel Monster (Level 1: Medium & Level 2: Tough)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## 🎯 Overview
An installable Progressive Web App (PWA) with a cute floating monster bubble that tracks reel consumption over social media feeds and encourages mindful digital habits.

## 🛠️ Key Features
- **PWA Architecture:** Fully installable on Android and iOS homescreens via `manifest.json` and `sw.js`.
- **Draggable Floating Monster Overlay:** Floats above built-in simulated Instagram Reels and YouTube Shorts feeds.
- **Dual Detection Engine:** Level 1 manual tap counter + Level 2 automatic simulated scroll-swipe detector.
- **Mascot Evolution:** Monster evolves through 4 distinct stages with sarcastic guilt dialogues as reel count climbs.
- **7-Day Analytics:** Interactive bar chart visualizing daily reel counts and productive hours lost.

## 🚀 How to Run
Open `index.html` directly in any browser or install on mobile:
```bash
python3 -m http.server 8080
```
Navigate to `http://localhost:8080/project-06-reel-monster/`.

## ✅ "Done When" Verification
- [x] Installs as a standalone PWA on mobile phones.
- [x] Floating bubble stays visible and draggable on top of simulated feeds.
- [x] Reel counts survive browser refresh and device restart in `localStorage`.
- [x] Operates 100% offline with zero internet access and zero login.
