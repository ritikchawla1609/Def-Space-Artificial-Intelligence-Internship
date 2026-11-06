---
name: resume-roast
description: Perform an unflinching, brutally honest, and high-impact critique of a candidate resume against a specific job posting, identifying fluff, buzzwords, and missing metrics.
---

# Resume Roast & Alignment Skill (`/resume-roast`)

## Purpose
Cut through generic resume filler. Provides blunt, actionable feedback by cross-referencing candidate experience bullets with target job requirements, uncovering weak verbs, passive voice, missing impact metrics, and offering drop-in bullet replacements.

## Audit Workflow
1. **Requirement Cross-Check**: Compare resume skills against mandatory job post criteria.
2. **The "Who Cares?" Test**: Flag every bullet point that lists duties rather than measured outcomes.
3. **Fluff Stripping**: Eliminate buzzwords like "hardworking team player", "synergy", or "responsible for".
4. **Concrete Fixes**: For every criticized line, provide a drop-in replacement following Google's formula:
   `"Accomplished [X], as measured by [Y], by doing [Z]"`
5. **Verdict**: Give a Fit Score (0-100%) and 3 non-negotiable fixes.

## Example Output
```text
> /resume-roast my-resume.pdf target-job.txt
ROAST VERDICT: 52% MATCH (Candidate sounds like an observer, not an engineer)

🚨 Biggest Blunders:
1. "Worked on machine learning models for internal teams."
   Who cares? Did it speed up anything? Did anyone use it?
   Fix: "Fine-tuned Llama-3 8B with LoRA on 120k domain samples, cutting latency by 34%."
2. Missing Docker & Kubernetes mentioned in 4 job requirements.
```
