---
id: prm-3c
title: "Framework 3C — Character, Context, Command"
type: principle
section: prompts
order: 1
status: valid
crosscutting: []
lang: en
translations: []
sources:
  - titre: "W2 - Prompt Engineering (fiche de révision examen)"
    emplacement: "Notion — STARTPLATZ / (archive) Fiches de révision"
    date_document: 2026-07-10
    nature: notebook
    url: null
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: []
portfolio: oui
summary: "A robust prompt separates the role (Character), the context (Context), and the task (Command)."
---

## Principle

A robust prompt separates its components instead of blending them into one paragraph. This card's title names them Character, Context and Command — role, background, and the action with its output format. The notebook's own glossary defines the framework differently: Contexte, Commande, Contrainte — context, command, constraint.

## Why it matters

The two readings are not equivalent. One puts the role first and folds output format into the command; the other drops the role and promotes the constraint to a component of its own. The prompts written in the W2 exercise follow the first reading — who the author is, then the need, then the execution request. Both sit in the same source, so the disagreement is reported here rather than resolved.

## How to apply it

- Write each component as a separate block, whichever reading you use.
- State the output format explicitly — inside the command or as a fourth constraint, never by implication.
- Reuse the same structure across a family of prompts so results stay comparable.

## Point of caution

The same notebook records a longer structure — role, task, specifics, context, examples, notes. 3C is a floor, not a ceiling.
