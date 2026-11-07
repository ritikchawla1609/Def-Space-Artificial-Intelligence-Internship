# Project 09: YouTube Focus Board (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## Overview
A Manifest V3 Chrome Extension and interactive testbed designed to strip distractions from YouTube and enforce intentional study sessions.

## Key Features
- **Distraction Removal Content Script:** One-click toggles to hide Shorts feeds, recommendation sidebars, and comments.
- **Study Playlist & Timestamp Notes:** Track learning playlists and save notes with clickable timestamps that jump the video to that exact second.
- **"Why Are You Here?" Session Gate:** Intentionality gate requiring the user to state their study objective before granting a 60-minute distraction-free session.

## Execution & Setup
- **Web Testbed:** Open `index.html` directly in any browser for immediate testing without installing an extension.
- **Chrome Extension:** Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select this folder.

## Verification & Acceptance Criteria
- [x] Content script maintains distraction blocking across YouTube SPA video navigations without page reload.
- [x] Clicking a timestamp note jumps the video directly to the specified second.
- [x] Study sessions and playlist notes survive Chrome restart in local storage.
