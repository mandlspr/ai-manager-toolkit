---
id: gov-responsible-ai
title: "Responsible AI framework — six layers"
type: principle
section: governance
order: 8
status: valid
crosscutting: [hitl, tracabilite]
lang: en
translations: []
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
links: [cas-handshake, bld-garde-fous-agents]
portfolio: oui
summary: "A governed, safe AI model rests on six layers: data, model, deployment, interaction, monitoring, and review."
---

## Principle

A responsible AI system is assessed through six layers, each carrying one question. Governance: should the AI be allowed to do this? Data: should these data be used for this purpose? Orchestration: what can the AI access, decide, execute or escalate? CX: what happens to the customer when it does? Monitoring: how do we know when reality diverges from intent? Accountability: who owns the outcome and who can intervene?

## Why it matters

The layers fail independently. A system can be permitted, run on appropriate data, and still have no answer to who intervenes when it goes wrong. The two layers most often skipped — CX and Accountability — are the ones that decide what a failure actually costs.

## How to apply it

- Answer all six questions explicitly before deployment; an unanswered layer is a gap, not a formality.
- Name an owner for Accountability — a role, not a team.
- Treat Monitoring as a detector of divergence between intent and reality, not as uptime.
- Re-run the six questions when the intended use changes, not only at launch.

## Point of caution

The framework is also summarised as Governance + Orchestration + Customer Outcomes, a compression that drops Data, Monitoring and Accountability from view. Use the six layers, not the shorthand.
