---
id: evl-profil-utilisateur
title: "Tool choice by user profile"
type: principle
section: evaluation
order: 3
status: valid
crosscutting: []
lang: en
translations: []
sources:
  - titre: "Notebook W4"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-08
    nature: notebook
    url: null
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: []
portfolio: oui
summary: "A tool excellent for one segment can be wrong for another. Evaluate fit by profile, not globally."
---

## Principle

Tool fit is assessed by user profile, not in the absolute. The same tool is the right answer for someone who wants the system to handle everything and the wrong answer for someone who intends to work in the code. The underlying models are largely shared; what differs is how much technical surface each tool exposes.

## Why it matters

Rankings written for one profile get applied to another, and the result is a team equipped with tools it cannot use, or tools that get in its way. The source is blunt about this: the tools mostly work the same way because they sit on the same models, the way a Golf and a Polo are both cars — what matters is who is driving.

## How to apply it

- Place the user on the technical scale first: no-code tools that handle everything at one end, IDE-class tools at the other.
- Let someone start on the simpler version and switch to the IDE version once they are comfortable; the gap is smaller than it looks.
- Test three or four and keep the one that gives the most tokens for the budget.
- Add a new tool only when the current one shows a real, concrete limit.

## Point of caution
