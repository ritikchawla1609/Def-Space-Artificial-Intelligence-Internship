# Project 15: One-Minute Reel Cut (Tough)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## 🎯 Overview
An automated video trimming and formatting engine that condenses raw footage into a punchy, 60-second 9:16 vertical video with burned-in karaoke subtitles.

## 🛠️ Key Features
- **Silence & Filler Word Detector:** Identifies pauses (>0.4s) and filler expressions (*"umm"*, *"uh"*, *"so basically"*).
- **Interactive Edit Plan Timeline:** Visual ribbon showing kept vs cut segments with manual toggle overrides.
- **9:16 Vertical Video Engine:** Simulates 1080×1920 mobile framing with face centering and title card overlay.
- **Burned-In Karaoke Subtitles:** Generates synced on-screen subtitles highlighting the active spoken word in real-time.
- **Python CLI Pipeline:** Includes standalone `cli-cutter.py` detailing the full FFmpeg command pipeline.

## 🚀 How to Run
Open `index.html` directly in any browser:
```bash
python3 -m http.server 8080
```
Navigate to `http://localhost:8080/project-15-one-minute-reel-cut/`.

## ✅ "Done When" Verification
- [x] Output video duration is strictly <= 60 seconds.
- [x] Over 20 consecutive lines of burned-in karaoke subtitles match transcript timings.
- [x] Vertical 9:16 crop keeps speaker face centered with title card banner.
