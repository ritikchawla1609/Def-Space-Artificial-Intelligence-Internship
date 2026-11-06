# Project 14: Tab Goblin (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## 🎯 Overview
A Manifest V3 Chrome Extension that monitors browser tab overload, reflects urgency through a reactive animated goblin mascot, and frees RAM by putting idle tabs to sleep.

## 🛠️ Key Features
- **Reactive Goblin Mascot:** Mood dynamically shifts from Happy (≤5 tabs) to Grumpy (6–15 tabs) to Enraged Panic (>15 tabs).
- **Tab Idle Tracker:** Lists all tabs sorted by idle duration.
- **"Feed the Goblin" RAM Saver:** Invokes native `chrome.tabs.discard` to suspend idle tabs without closing them.
- **Protected Keep List / Whitelist:** Protects active forms, documents, and code editors from automatic discarding.
- **Session Snapshot:** Save and restore full browser tab sessions.

## 🚀 How to Run
- **Web Testbed:** Open `index.html` directly in any browser to test tab discarding, whitelist protection, and mood animations.
- **Chrome Extension:** Load this folder in `chrome://extensions/` using "Load unpacked".

## ✅ "Done When" Verification
- [x] Mascot mood and dialogue react dynamically to tab count changes.
- [x] "Feed the Goblin" safely suspends idle tabs while respecting whitelist protections.
- [x] Tab session backup and restore functions seamlessly.
