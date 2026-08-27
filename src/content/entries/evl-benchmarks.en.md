---
id: evl-benchmarks
title: "A benchmark is partial evidence, not a score"
type: principle
section: evaluation
order: 1
status: valid
crosscutting: [tracabilite]
lang: en
translations: []
sources:
  - titre: "Playbook AI Governance"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-14
    nature: playbook
    url: null
  - titre: "Notebook W2"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-19
    nature: notebook
    url: null
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: [cas-stackfit]
portfolio: oui
summary: "A benchmark answers a precise question on a precise case. Sources disagree? That's a discovery, not a flaw."
---

## Principle

A benchmark is partial evidence of one capability on one kind of task, not a universal score of intelligence. Attach each requirement to the evidence that actually speaks to it — an autonomy requirement to long-horizon measurements, a tool-use requirement to tool-use evaluations — rather than producing a single ranking. When credible sources disagree, show the disagreement instead of averaging it away.

## Why it matters

A ranking compresses a trade-off into a number and then hides it. A model can be strong on academic reasoning and less robust on long agentic execution; a recommendation may still stand, but it has to expose the trade-off and the provenance of the evidence. Provider-published benchmarks are weakly differentiating, and each provider selects the tests that favour it.

## How to apply it

- Map each requirement to specific evidence before comparing anything.
- Follow the source hierarchy: official documentation and evaluations, then reproducible independent benchmarks, then internal field measurement, then anecdote.
- Date every result — models, versions, reasoning modes and tooling move too fast for a score to stay true.
- Test on your own task under real conditions, the only evaluation that answers your question.

## Point of caution

Community pairwise ranking tracks real usage more closely, but it is a snapshot: today's order between providers can be different tomorrow.
