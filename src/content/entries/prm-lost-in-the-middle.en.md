---
id: prm-lost-in-the-middle
title: "Lost in the Middle"
type: principle
section: prompts
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
summary: "Models weight information at the start and end of context more heavily. Place critical data at the extremes."
---

## Principle

Models weight the beginning and the end of a long context more heavily than the middle. Put critical information at one of the two extremes — primacy at the start, recency at the end — and never bury an instruction that must be followed inside the middle of a large prompt.

## Why it matters

The failure is silent. A prompt that has grown by accretion still returns a well-formed answer; it simply stops honouring the constraint that ended up in the middle. Nothing in the output signals that an instruction was dropped, so the natural reaction is to add more text, which makes the problem worse.

## How to apply it

- Open with the role and the non-negotiable constraints; close with the output format and any last-chance notes.
- When a prompt has grown too large, split it rather than reordering it again.
- Test by moving a known constraint from the middle to an extreme and comparing the outputs.

## Point of caution

The source records that this does not apply to retrieved sources: material brought in through RAG lands in a separate space and broadens the analysis without replacing the initial query, with no lost-in-the-middle effect. The prompt still decides how far each source is prioritised.
