---
id: gov-double-test
title: "Double-test before deciding"
type: principle
section: governance
order: 1
status: valid
crosscutting: [tracabilite]
lang: en
translations: []
sources:
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
summary: "Evaluating twice with distinct criteria increases the robustness of judgment and reduces systematic bias."
---

## Principle

Run a governance assessment twice, through two evaluators that do not share the same calibration, before treating the verdict as decided. A single evaluator produces a verdict that reflects its own thresholds as much as it reflects the case under review.

## Why it matters

StackFit assessed Handshake once and returned Fairness / Bias as "no specific blocker identified" — green — on a workflow explicitly built around fairness, segmentation and proxy risk. The verdict was internally consistent; the calibration was wrong. Nothing inside the first pass could have surfaced that.

## How to apply it

- Give the second evaluator the same case, unmodified — a changed input tests nothing.
- Use a second evaluator with a different calibration, not a second run of the first.
- Record each verdict with its date and its evaluator; a verdict without provenance cannot be re-examined later.
- Treat a divergence as the finding, and fix the rule that produced it rather than the individual output.

## Point of caution

The project files disagree on this test's own record: the Project Log reports a Fit verdict with three corrections pending, while the final Handshake README reports "Fit with conditions" after four calibration fixes. The disagreement is left standing here rather than resolved.
