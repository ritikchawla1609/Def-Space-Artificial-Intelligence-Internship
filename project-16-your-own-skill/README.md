# Project 16: Your Own Skill (Medium)
**Bharat Space Education Research Centre · GenAI Internship · Week 2**
**Instructor:** Karan Bagul | **Engineer:** Ritik Chawla

---

## Overview
3 production-grade agent skills adhering to Antigravity SKILL.md standards, accompanied by test fixture inputs, a comparative evaluation audit, and an interactive Skill Runner.

## Included Agent Skills
1. **`/viva`** (`skills/viva/SKILL.md`): Interactive 5-question oral defense examiner for study notes with scoring rubrics and follow-up probes.
2. **`/resume-roast`** (`skills/resume-roast/SKILL.md`): Unflinching line-by-line resume critique testing ATS keywords and quantifiable metrics against real job descriptions.
3. **`/one-page-revision`** (`skills/one-page-revision/SKILL.md`): High-yield single-page cheat sheet generator distilling complex textbook chapters into high-retention formulas and tables.

## Bundled Test Inputs
- `test-inputs/study-notes-cn.md` (Computer Networks & TCP/IP)
- `test-inputs/resume-draft.md` (Software Engineer Resume)
- `test-inputs/physics-thermo.md` (Thermodynamics Chapter)

## Execution & Setup
Open `index.html` directly in any browser to execute skills against sample inputs:
```bash
python3 -m http.server 8080
```
Navigate to `http://localhost:8080/project-16-your-own-skill/`.

## Verification & Acceptance Criteria
- [x] Skill executes successfully in a brand-new agent session.
- [x] Tested against 3 diverse input documents with full comparative evaluation in `comparative-evaluation.md`.
