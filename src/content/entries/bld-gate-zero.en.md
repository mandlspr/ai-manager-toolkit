---
id: bld-gate-zero
title: "Gate 0 and the three causes of automation failure"
type: principle
section: build
order: 1
status: valid
crosscutting: [cout]
lang: en
translations: []
sources:
  - titre: "Notebook W5"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-25
    nature: notebook
    url: null
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: []
portfolio: oui
summary: "Before building an agent, check three conditions: the problem is solvable, the data is available, the cost is justified."
---

## Principle

Two things must be settled before a tool is chosen: the objective is clearly defined, and the data sources have been examined and are fit for the case. In the source sequence, choosing the tools is the third step, after defining the objective and analysing the data. The ordering is the rule.

## Why it matters

A tool chosen before the objective is fixed encodes the confusion instead of resolving it. Data cleanliness is a precondition, not an afterthought: bad data produces bad AI whatever sits downstream. Both mistakes surface late, once the workflow exists and is expensive to undo.

## How to apply it

- Check the three risks the source names before building: over-automation; poorly defined processes or general uncertainty about the objectives; lack of documentation for the future.
- Define the objective in one sentence someone else could act on.
- Inspect the data sources, adjust them for the test case, and handle the edge cases before wiring anything.
- Document as you go, in comments — the third risk is the one that only charges you later.

## Point of caution

The source calls these risks of automation projects rather than causes of failure, and does not use the term "Gate 0" — that framing is this toolkit's own.
