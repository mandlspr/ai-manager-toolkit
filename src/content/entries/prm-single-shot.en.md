---
id: prm-single-shot
title: "A single-shot prompt has no second chance"
type: principle
section: prompts
order: 4
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
  date: 2026-08-29
  by: "revue croisée audit W1–W7 (29.08) + relecture manuelle"
  scope_limit: null
links: [prm-3c, bld-gate-zero]
portfolio: oui
summary: "The split that decides whether a prompt can be automated: conversational prompts get a next turn to recover, single-shot prompts run once, unattended, and must be right first time."
---

## Principle

The fundamental split when applying a prompt is single-shot versus conversational. A conversational prompt runs in a dialogue, where a human can steer the next turn. A single-shot prompt runs once, unattended, inside an automated workflow — it must be right first time, because there is no follow-up and no one watching. That property decides whether a prompt can be industrialised.

## Why it matters

A prompt that works in chat is not yet a prompt that works in production. In a dialogue a wrong answer is corrected in the next message; in a chain it propagates silently and takes the workflow down, and it is hard to see because no human is in the loop.

## How to apply it

- Before automating a prompt, ask whether a human reads each output. If not, it must be single-shot.
- Give it a defined role, the relevant context and constraints, and an explicit output format — the parts a person would otherwise add by follow-up.
- Test the edge cases, not the happy path; there is no recovery turn.

## Point of caution

The source frames structured single-shot prompting as the interface to automated systems — hold it to the standard of code, not the informality of chat.
