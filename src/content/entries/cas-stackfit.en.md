---
id: cas-stackfit
title: "StackFit — double-test and the calibration effect"
type: case
section: cases
order: 1
status: valid
crosscutting: []
lang: en
translations: []
proves: [gov-double-test, gov-jamais-vert, evl-benchmarks]
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
links: [gov-double-test, gov-jamais-vert, evl-benchmarks]
portfolio: oui
summary: "The same project evaluated twice with different frameworks produces different verdicts. Governance applies to itself."
---

## Context

StackFit answers one question: can this task be accomplished with the current stack, under what conditions, and is the stack unnecessarily complex. Its first end-to-end test was Handshake, a governed QBR workflow with a known runtime stack. What was at stake was not finding a better model, but whether an existing prototype stack was sufficient.

## What was done

The Handshake task was entered unchanged, together with its actual runtime stack: gpt-5-nano, Supabase, n8n, CSM human review, Notion, Hoppscotch and an n8n webhook. The tool produced a capability profile, a seven-dimension governance heatmap, and a single verdict. The same unmodified project was then assessed again under different calibration.

## Result

The first pass returned Fit, with Fairness / Bias marked green — on a workflow explicitly built around fairness, segmentation and proxy risk. The verdict was internally consistent and wrong at the calibration level, which is what makes the case worth citing: the gap between two verdicts on an unchanged project is a property of the evaluators, not of the project. The correction was a rule, not an output fix: fairness may no longer default to green when the task itself names fairness, segmentation, bias or proxy variables. Sources disagree on the second verdict's record — the Project Log lists three corrections pending, the final README reports "Fit with conditions" after four calibration fixes.
