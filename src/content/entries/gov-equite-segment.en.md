---
id: gov-equite-segment
title: "Fairness by segment — the average hides the local"
type: principle
section: governance
order: 7
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
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: [cas-handshake]
portfolio: oui
summary: "Evaluate fairness by segment or user profile, never on average. Local disparities need local measures."
---

## Principle

Assess fairness by segment, never on the aggregate. A global average can sit within tolerance while a specific segment — a language, a region, an account tier — is treated systematically worse. The average summarises the population; it says nothing about any part of it.

## Why it matters

Handshake computes minority status dynamically from the actual portfolio distribution rather than from a hard-coded rule. Across its test accounts the region field is evenly split (DACH 4, non-EU 4, EU 4) and no region minority is detected, while the language field (DE 4, EN 5, FR 2, other 1) surfaces two. A single fairness score over the same portfolio would have shown neither. The mechanism is right precisely because it stays silent when there is nothing to flag.

## How to apply it

- Define the segments before measuring, from the dimensions the system actually acts on.
- Derive minority status from the live distribution rather than from a fixed list.
- Require a local measure for a local disparity; a global correction hides it again.

## Point of caution

A disparity signal is monitoring evidence, never proof that bias exists or that it is absent.
