---
id: gov-datasheet-dataset
title: "Datasheet for dataset"
type: principle
section: governance
order: 9
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
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: []
portfolio: oui
summary: "Document training data, its provenance, and its known limits — a practice of transparency and accountability."
---

## Principle

A dataset travels with its own governance artefact, structured as DATA → PURPOSE → RISK → OWNER → CONTROLS → MONITORING. It covers three areas: ethics and risk (provenance, consent, populations represented, bias), purpose and fair use (a dataset is never universally reusable), and ownership and lifecycle (traceability, versioning, documentation that lives with the data).

## Why it matters

There is no AI governance without data governance. A model governed correctly at the technical level still produces bad results if its data is biased, opaque or out of context. And the governed object is the pair, not the data alone: the question is not "can we use this data?" but "should we use this data for this specific purpose, population and decision?"

## How to apply it

- Write the datasheet when the dataset is created, not when it is questioned.
- Record the purpose the data was approved for, and re-open the datasheet when a new purpose appears.
- Assign an owner and a version — documentation without either is decorative governance.
- Keep the datasheet inside the same lifecycle as the data; it is updated with the data or it is wrong.

## Point of caution
