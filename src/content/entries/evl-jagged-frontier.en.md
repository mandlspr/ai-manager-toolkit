---
id: evl-jagged-frontier
title: "Jagged Frontier"
type: principle
section: evaluation
order: 2
status: valid
crosscutting: []
lang: en
translations: []
sources:
  - titre: "Notebook W2"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-19
    nature: notebook
    url: null
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: []
portfolio: oui
summary: "AI models excel at some tasks and stumble on others, with no linear progression. Performance is multi-dimensional."
---

## Principle

Model performance is jagged, not a smooth curve. The same model can solve olympiad-level mathematics and fail to read an analogue clock. "The model is good" means nothing without saying good at what: capability is multi-dimensional, and the boundary between what works and what does not is irregular.

## Why it matters

The jaggedness breaks the transfer of trust. A model that performs impressively on a demanding task earns credibility that then gets extended to an adjacent task where it happens to fail — and nobody re-tests, because the first result was so strong. The failures land in unremarkable places, which is exactly where nobody is watching.

## How to apply it

- Evaluate on the specific task you intend to run, not on a neighbouring one.
- Re-test when the task changes, even slightly; adjacency is not evidence.
- State capability claims with their task attached: reliable on this classification, unverified elsewhere.
- Expect surprises at the low end of difficulty as often as at the high end.

## Point of caution
