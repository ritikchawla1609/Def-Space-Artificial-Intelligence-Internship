# Project 12: Chat Saver (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## 🎯 Overview
A Manifest V3 Chrome Extension that exports AI chat conversations from ChatGPT, Claude, and Gemini as clean Markdown or formatted PDF documents in one click.

## 🛠️ Key Features
- **Universal Multi-Platform Scraping:** Detects message blocks across ChatGPT, Claude, and Gemini.
- **Preserves Formatting:** Keeps code blocks with syntax tags, tables, markdown headers, and bullet lists.
- **Selective Export:** Checkbox toggles allow exporting the full conversation or only selected messages.
- **One-Click Export:** Download clean `.md` or formatted `.pdf` named after the chat title.

## 🚀 How to Run
- **Web Testbed:** Open `index.html` directly in any browser to run a 50+ message stress test simulator.
- **Chrome Extension:** Load this folder in `chrome://extensions/` using "Load unpacked".

## ✅ "Done When" Verification
- [x] Exports 50+ message conversation without memory leaks or dropped formatting.
- [x] Preserved code blocks remain intact and runnable when copied out.
- [x] Exports both clean Markdown (.md) and multi-page PDF (.pdf) documents.
