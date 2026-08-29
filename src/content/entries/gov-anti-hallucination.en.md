---
id: gov-anti-hallucination
title: "Three anti-hallucination levers, ranked"
type: principle
section: governance
order: 3
status: valid
crosscutting: [hitl]
lang: en
translations: []
sources:
  - titre: "Playbook AI Governance"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-14
    nature: playbook
    url: null
  - titre: "audit/prompt_enrichment.json"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-29
    nature: notebook
    url: null
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: []
portfolio: oui
summary: "Constrained format, explicit prohibition on inventing, real context. The third is the most impactful."
---

## Principle

Three levers reduce hallucination, and they are not equal. A constrained output format narrows what the model can produce. An explicit prohibition on inventing removes the ambiguity about what to do when the answer is missing. Supplying enough real context is the third and the most impactful — the first two constrain the shape of an answer, this one changes what the model has to answer from.

## Why it matters

In a customer-facing bot, a hallucinated price, guarantee or discount can legally bind the company. Anti-hallucination guardrails are therefore contract-risk management, not only output quality. The first two levers can also make a wrong answer look well-formed and confident, which is harder to catch than a visibly broken one.

## How to apply it

- Impose a structured output format and closed categories before tuning prompt wording.
- State explicitly what the model must do when it does not know, rather than assuming it will abstain.
- Invest first in grounding: retrieval over a real knowledge base, real account data, real documents.

## Point of caution

None of the three levers removes the risk entirely, which is why human review sits alongside them rather than after them.

## Reusable prompt

Guardrail block — forces the model to open and read a referenced source before making any claim about it (W2, `W2T1_Claude_Best Prompting Practices.pdf`).

```
<investigate_before_answering>
Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering. Make sure to investigate and read relevant files BEFORE answering questions about the codebase. Never make any claims about code before investigating unless you are certain of the correct answer grounded and give
</investigate_before_answering>
```

Reproduced as-is, including the sentence left unfinished at the end of the block. Note: generalises beyond code — "never assert on a source you haven't opened." Limit: raises input-token cost and latency.
