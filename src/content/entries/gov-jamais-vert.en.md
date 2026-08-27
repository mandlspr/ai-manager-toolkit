---
id: gov-jamais-vert
title: "No case is green by default"
type: principle
section: governance
order: 5
status: valid
crosscutting: []
lang: en
translations: []
sources:
  - titre: "Playbook AI Governance"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-14
    nature: playbook
    url: null
  - titre: "StackFit V1 — Handshake Project Log"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-14
    nature: projet
    url: null
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: [cas-stackfit]
portfolio: oui
summary: "Every use is subject to explicit governance. No default color; the burden of proof sits with approval."
---

## Principle

No use case is green by default. The lowest tier of a risk grid is a floor, not an all-clear: minimal legal risk still carries documented self-validation and a level of human control that is minimal but never zero. Green is a conclusion earned by evidence, never a starting state.

## Why it matters

Two independent sources converge here, and that convergence is what makes the rule hold. The Playbook records it as a correction from the course instructor on 12/08: a minimal or no-risk legal classification maps to a floor, never to pure green. The StackFit log reaches the same rule from the opposite direction — after a fairness dimension defaulted to green on a workflow built around fairness, the fix was to require explicit justification before green can be returned at all. One argument is legal, the other is engineering; they agree.

## How to apply it

- Make the lowest tier of any grid "documented self-validation", not "nothing to do".
- Require a recorded reason for every green, and treat a missing reason as not-green.
- Set a minimum floor for any dimension the use case itself names — a fairness-related task cannot return green on fairness without an argument.

## Point of caution
