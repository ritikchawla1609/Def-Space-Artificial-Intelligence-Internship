# Comparative Evaluation: With Custom Skill vs Without Skill
**Bharat Space Education Research Centre · GenAI Internship**
**Project 16: Your Own Skill Evaluation Report**

---

## 1. Test Input 1: Oral Defense Viva Voce (`/viva thermo-notes.pdf`)

### Without Custom Skill (Raw Prompting)
- **User Prompt**: "Ask me questions on my thermodynamics notes."
- **Raw Agent Behavior**:
  - Dumps all 5 questions at once in a giant numbered list.
  - Doesn't wait for student response before continuing.
  - Gives generic "Good job!" or "Incorrect" without probing the underlying physical mechanisms.
  - Doesn't reference page numbers or provide targeted revision recommendations.
- **Defects**: Destroys the interactive viva format; the student reads all answers simultaneously.

### With Custom Skill (`/viva`)
- **Invocation**: `> /viva thermo-notes.pdf`
- **Output**:
  ```text
  Reading notes. Asking 5 questions, one at a time.
  Q1. State the Clausius formulation of the Second Law of Thermodynamics.
  > Heat cannot flow spontaneously from cold to hot.
  Examiner: Correct, but specify without external work input.
  
  Q2. Why can no engine beat Carnot efficiency?
  > Because of friction.
  Examiner: Partly. Friction lowers real engines, but what about an ideal one?
  Score: 3/5. Revise page 14.
  ```
- **What Got Better**:
  1. Strict turn-by-turn enforcement (one question at a time).
  2. Nuanced diagnostic feedback ("Partly... but what about an ideal one?").
  3. Actionable final grading and exact revision guidance (`Revise page 14`).

---

## 2. Test Input 2: Resume Critique (`/resume-roast`)

### Without Custom Skill (Raw Prompting)
- **User Prompt**: "Review my resume against this job."
- **Raw Agent Behavior**:
  - Overly polite sycophantic praise: "Great resume! You have a lot of potential."
  - Vague suggestions: "Consider adding more details to your projects."
  - Misses that key technical requirements (Docker, Kubernetes, Redis) are completely absent.

### With Custom Skill (`/resume-roast`)
- **Invocation**: `> /resume-roast alex-resume.txt target-job.txt`
- **Output**:
  ```text
  ROAST VERDICT: 48% MATCH (Observer, not an impact-driven engineer)
  
  Critical Missing Skills:
  - Job requires production Docker & Kubernetes. Your resume has ZERO mention.
  - Job requires quantitative metrics. You have zero numbers or latency metrics.
  
  Bullet Rewrites:
  • OLD: "Worked on backend APIs using Python and Flask."
    NEW: "Engineered 14 RESTful microservices in Python/Flask with Redis caching, supporting 2,500 daily requests with 99.9% uptime."
  ```
- **What Got Better**:
  1. Complete removal of fluff and unearned praise.
  2. Direct metric insertion using Google's X-Y-Z formula.
  3. Gap analysis against mandatory job requirements.

---

## 3. Test Input 3: Quick Revision Cheat Sheet (`/one-page-revision`)

### Without Custom Skill
- Generates 8 pages of verbose text repeating the textbook chapter verbatim.
- No visual memory anchors or distinction between primary laws and edge cases.

### With Custom Skill
- Compresses the chapter into a crisp, high-density 1-page cheatsheet with ASCII gate diagrams, formula matrices, and a 5-question rapid recall test.

---
### Verification Checklist
- [x] Starts correctly in a fresh session with clean frontmatter invocation.
- [x] Tested and verified on 3 distinct inputs (Thermodynamics, Software Resume, Quantum Computing).
- [x] Comparative evaluation clearly shows actionable metric improvements.
