---
id: bld-orchestration
title: "Orchestration dos and don'ts"
type: principle
section: build
order: 3
status: valid
crosscutting: [cout]
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
summary: "Orchestrating agents in parallel reduces latency; sequential orchestration reduces cost. Choose based on the trade-off accepted."
---

## Principle

The orchestrator, not the model, carries the logic. The model is one computation step in a chain; the orchestrator decides which tools run, in which order, what context is loaded, and whether a result is acceptable before it goes anywhere. An agent without an orchestrator is a prompt with ambitions.

## Why it matters

Most agent failures are orchestration failures wearing a model's clothes. Loading an entire shared drive or ticket history into the context window overwhelms the model and spends tokens on material it will not use. An agent with no stopping condition will search and rewrite indefinitely. Neither is fixed by a stronger model.

## How to apply it

- Inject only relevant portions through a retriever; never load a whole folder or history at once.
- Build the prompt in the orchestrator rather than letting users iterate "pls fix" — a standardised prompt gives reproducible quality.
- Test each tool and each node in isolation before assembling the chain; the error message rarely points at the real cause.
- Set an explicit stopping condition, and validate outputs before any action executes.

## Point of caution

The agent has no common sense and assumes no intent: what is not written does not exist for it.
