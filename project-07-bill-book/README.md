# Project 07: Bill Book (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## Overview
Offline-first Point-of-Sale and billing PWA designed for small shopkeepers, featuring instant item catalogs, dynamic UPI QR generation, and WhatsApp sharing.

## Key Features
- **Shopkeeper POS Engine:** Quick-tap catalog (Chai, Samosa, Biscuit, Filter Coffee, Maggi), custom qty/rate modifiers, discount, and tax calculation.
- **Dynamic Offline UPI QR Code:** Generates pure-vector NPCI-compliant payment QR codes (`upi://pay?pa=...&am=...`) using bundled `qrious.min.js`.
- **One-Click Sharing:** Formats clean WhatsApp invoice messages and renders downloadable PNG receipt images.
- **Daily Gross Revenue Tally:** Searchable bill log with verified daily sales total (pre-loaded with ₹4,860 across 5 bills).

## Execution & Setup
Open `index.html` directly in any browser or install on phone:
```bash
python3 -m http.server 8080
```
Navigate to `http://localhost:8080/project-07-bill-book/`.

## Verification & Acceptance Criteria
- [x] Bill totals match hand calculation on 5 consecutive sample bills.
- [x] Functions 100% in airplane / flight mode with previous bills preserved.
- [x] UPI apps (Google Pay, PhonePe, Paytm) scan generated QR and display exact bill total.
