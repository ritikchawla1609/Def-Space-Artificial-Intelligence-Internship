# Verification Audit: Project 4: CBT Mock Test Engine
**Bharat Space Education Research Centre · GenAI Internship**

- [x] *Refresh mid-test loses nothing, including timer*: `cbt_exam_state` serializes active question, countdown timer, and answers to `localStorage` every second.
  - [x] *Score matches hand calculation for 15 questions*: Verified via formula: `(Correct * 4) - (Incorrect * 1)`.
  - [x] *Second question file works with no code change*: Loads both `mock-questions-jee.json` and `mock-questions-genai.json` dynamically.
