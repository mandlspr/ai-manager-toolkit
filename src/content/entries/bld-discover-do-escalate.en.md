---
id: bld-discover-do-escalate
title: "Discover → Do → Escalate"
type: principle
section: build
order: 5
status: valid
crosscutting: [hitl]
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
links: []
portfolio: oui
summary: "Agent orchestration pattern: discover the problem, resolve it with limited tools, escalate to a human when needed."
---

## Principle

Structure an internal copilot in three tiers. Discover: the knowledge base deliberately constrains the model rather than letting it answer from general knowledge. Do: standard requests are handled directly. Escalate: everything else goes up. The point is that not every request belongs at the same level of autonomy.

## Why it matters

A single level of autonomy is wrong in both directions at once. Either routine requests carry unnecessary friction, or the ambiguous and high-stakes ones get answered by a system that should have escalated. Grounding the model in the knowledge base is what makes the first tier trustworthy enough to run without a human on every request.

## How to apply it

- Bind the model to the knowledge base first; general knowledge is the fallback nobody authorised.
- Define what counts as a standard request explicitly, and route everything outside that definition upward.
- Enrich before deciding — cross the incoming request with existing customer data so priority reflects more than the text.
- Measure time-to-go-live and resolution speed, not classification accuracy alone.

## Point of caution

Escalation only works if the escalated case arrives with its context attached; a transfer without it moves the problem rather than raising it.
