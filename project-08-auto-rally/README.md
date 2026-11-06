# Project 08: Auto Rally (Tough)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## 🎯 Overview
Fast-paced HTML5 Canvas auto-rickshaw racing game featuring pseudo-3D curved highways, Indian roadside obstacles, and procedural Web Audio sound synthesis.

## 🛠️ Key Features
- **2.5D Curved Road Engine:** Smooth pseudo-3D parallax road rendering with roadside scenery.
- **Dual Control Scheme:** Keyboard (Arrow keys / WASD, Space for Nitro, H for Horn) and mobile touch buttons.
- **Indian Road Obstacles:** Holy cows, potholes, slow taxis, and heavy trucks; collect gold coins and Chai Nitro Boosts.
- **Synthesized Web Audio SFX:** 100% procedural audio (auto-rickshaw two-stroke engine hum, twin-tone "Pom Pom" horn, coin chime, crash) with mute toggle.
- **3-Lap Championship:** Lap timer with personal best lap record saved to `localStorage`.

## 🚀 How to Run
Open `index.html` directly in any browser:
```bash
python3 -m http.server 8080
```
Navigate to `http://localhost:8080/project-08-auto-rally/`.

## ✅ "Done When" Verification
- [x] Full race plays smoothly on phone in flight mode with 60 FPS canvas performance.
- [x] Player finishes race without instructions thanks to clear HUD cues and responsive steering.
- [x] Collision hitboxes feel fair and rewarding; high score persists across page reloads.
