---
id: prm-debug-agent
title: "Three questions before concluding \"the agent is bad\""
type: principle
section: prompts
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
summary: "Before concluding the agent is bad, ask three questions: is the model too weak, are the embeddings/vectorisation correct, is a tool or MCP access missing?"
---

## Principle

When an agent underperforms, three questions come before any conclusion about the agent itself. Are you using the right model, or is it too weak for the task? Are the embeddings correct — is the data properly vectorised? Is a tool or a data access (MCP) missing? Only after all three is "the agent is bad" a finding rather than a reflex.

## Why it matters

Each question maps to a different component of the chain: the model, the retrieval layer, the tool and access layer. They fail differently and are fixed differently. Skipping them turns a diagnosable configuration problem into a verdict on the technology, and the same failure returns on the next build.

## How to apply it

- Ask the three in order; the cheapest fix is as often the last as the first.
- Test each component in isolation before blaming the chain — credentials verified outside the orchestrator, retrieval checked against a known query.
- Remember that in a multi-node pipeline the visible failure is rarely the cause.

## Point of caution

The same discipline applies to an agent that appears to work: an answer that looks logical but lands off-target usually comes from a missing access, not a weak model.
