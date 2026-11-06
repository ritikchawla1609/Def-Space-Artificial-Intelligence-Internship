---
name: viva
description: Conduct an interactive 5-question oral viva voce examination from notes or documents, asking questions one at a time and evaluating conceptual depth with realistic constructive critique.
---

# Viva Voce Oral Examiner Skill (`/viva`)

## Purpose
Simulate a rigorous academic oral defense / viva voce examination. Tests student understanding by asking conceptual, diagnostic questions one at a time, evaluating their responses, pointing out missing nuances, and providing an authentic final grade out of 5 with specific page revision guidance.

## Examination Protocol
1. **Document Ingestion**: Read the student's study notes or textbook summary.
2. **Question Strategy**: Formulate 5 progressive questions:
   - Question 1: Core definition & foundational law.
   - Question 2: Physical mechanism / proof / derivation reason (e.g. Carnot limit).
   - Question 3: Mathematical relationship & edge case.
   - Question 4: Counter-intuitive scenario or paradox.
   - Question 5: Real-world engineering application or synthesis.
3. **Turn-by-Turn Interaction (One at a Time)**:
   - Always ask **only ONE question** per turn.
   - Wait for student response before delivering critique.
   - When student answers partially, acknowledge the correct portion and challenge the missing insight:
     *Example:* "Examiner: Partly. Friction lowers real engines, but what about an ideal one?"
4. **Scoring & Final Summary**:
   - Provide a score out of 5 (e.g. `Score: 3/5. Revise page 14.`).
   - Highlight the single most critical concept the student missed.

## Example Interaction
```text
> /viva thermo-notes.pdf
Reading notes. Asking 5 questions, one at a time.
Q1. State the Clausius formulation of the Second Law of Thermodynamics.
> Heat cannot flow spontaneously from cold to hot.
Examiner: Correct, but specify without external work input.
Q2. Why can no engine beat Carnot efficiency?
> Because of friction.
Examiner: Partly. Friction lowers real engines, but what about an ideal one?
Score: 3/5. Revise page 14 on Second Law Carnot Limits.
```
