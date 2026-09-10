---
id: bld-garde-fous-agents
title: "Eight guardrails for agents"
type: principle
section: build
order: 6
status: valid
crosscutting: [hitl, tracabilite]
lang: en
translations: []
diagram: ifg-06-what-reaches-the-model
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
links: [gov-responsible-ai]
portfolio: oui
summary: "Token limits, tool allowlists, reversible archiving, monitoring — the essential guardrails for a production agent."
---

## Principle

Eight guardrails define a production agent: minimum permissions, a limited set of tools, human approval for dangerous actions, strict access control on sensitive data, systematic logging of every action, clear stopping conditions, output validation before execution, and blocking on uncertain or low-confidence results. A safe agent is not one that never makes mistakes — it is one constrained enough that its mistakes do not become serious harm.

## Why it matters

Each guardrail closes a failure mode the others leave open. Logging without stopping conditions gives you a complete record of a runaway loop. Output validation without confidence blocking lets a well-formed wrong answer through. The eight work as a set, not as a menu.

## How to apply it

- Grant read-only access by default and widen it only against a named need.
- Give the agent reversible archiving rather than permanent deletion: deletion is irreversible by nature, archiving always leaves a route back.
- Log every action, including the ones that were blocked.
- Define what counts as dangerous for this agent before deployment, not at the first incident.

## Point of caution

Reversible archiving is recorded as a separate mandatory check, not as one of the eight. Applying the eight alone still leaves permanent deletion technically permitted.
