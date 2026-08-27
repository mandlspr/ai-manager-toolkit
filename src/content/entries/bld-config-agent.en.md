---
id: bld-config-agent
title: "Agent config — four constant ingredients"
type: principle
section: build
order: 2
status: valid
crosscutting: []
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
summary: "Model, temperature, token limit, and tools — four configuration variables that govern agent behavior."
---

## Principle

Agent configuration rests on four constant ingredients: the system prompt, the rules, the skills, and the tools. In the source diagram these occupy the top block, above the provider platform and the data layer — the model tier belongs to the platform, not to the agent's configuration.

## Why it matters

The distinction decides where a change belongs. Swapping the model is a platform decision; changing what the agent may do is a configuration decision. Treating them as one layer is how an agent ends up rebuilt every time a provider ships a new model. The system prompt holds the fixed part — role, standing rules, constraints, output format — while the user prompt carries what varies at each run.

## How to apply it

- Keep the four ingredients in separate, named places rather than in a single prompt blob.
- Put anything invariant in the system prompt; anything that changes per execution belongs in the user prompt.
- Version the rules and the tool list independently of the model.
- When behaviour shifts unexpectedly, check which of the four moved before blaming the model.

## Point of caution

Temperature and token limits appear in the same sources, but as cost guardrails rather than as ingredients of agent configuration.
