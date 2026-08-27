---
id: gov-cycle-de-vie
title: "Governance across the product lifecycle"
type: principle
section: governance
order: 10
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
summary: "AI governance must be revisited at key stages: design, launch, growth, and continuously after production."
---

## Principle

Governance is reviewed at six points in the product lifecycle, each with its own question. Discovery: should we use AI for this? Analysis and design: can we build it responsibly? Development: can we control and explain it? Launch: is it behaving as expected? Scale and growth: is it still safe at scale? Post-mortem or retirement: what do we retain, change or stop?

## Why it matters

The questions are not interchangeable and they cannot be deferred. "Should we use AI for this", answered at launch, is a rationalisation rather than a decision. Scale changes the answer even when nothing in the system changed: behaviour that is acceptable across a hundred accounts can exclude a segment across ten thousand.

## How to apply it

- Attach each question to its stage gate so the review cannot be skipped silently.
- At discovery, identify which interactions must stay human before designing anything.
- At development, provide for human-in-the-loop, escalation, fallback and a route back to a human.
- At scale, monitor outcomes by segment, channel and use case rather than in aggregate.
- At retirement, feed incidents and customer impact into the next system instead of closing the file.

## Point of caution
