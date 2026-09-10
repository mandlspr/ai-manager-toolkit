---
id: gov-ai-act-risques
title: "Classify by intended purpose, not by how alarming it sounds"
type: principle
section: governance
order: 12
status: valid
crosscutting: []
lang: en
translations: []
diagram: ifg-08-where-does-it-land
sources:
  - titre: "Notebook W7"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-08
    nature: notebook
    url: null
  - titre: "Notebook W6"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-08
    nature: notebook
    url: null
  - titre: "Playbook AI Governance"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-14
    nature: playbook
    url: null
  - titre: "audit/prompt_enrichment.json"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-29
    nature: notebook
    url: null
verified:
  date: 2026-08-29
  by: "revue croisée audit W1–W7 (29.08) + relecture manuelle"
  scope_limit: "Application timeline for high-risk obligations (Annex I and III) is unresolved across the sources and the Digital Omnibus is not finally adopted — no firm date is cited."
links: [gov-jamais-vert, gov-responsible-ai]
portfolio: oui
summary: "The EU AI Act sorts a use case by what it is for, not by how it sounds — and Article 4, the AI-competence duty, applies at every risk level."
---

## Principle

The EU AI Act triages a use case by its intended purpose, its context, who is affected, and the AI's role in the decision — not by how alarming it seems. Four classes: unacceptable (prohibited — social scoring by authorities, manipulation, emotion recognition at work); high risk (obligations before deployment — recruitment, credit scoring); limited risk (transparency — chatbots, deepfakes); minimal risk (none). One duty cuts across all four: Article 4, the AI-competence obligation, in force since 2 February 2025.

## Why it matters

Article 4 is a best-efforts obligation (*Bemühenspflicht*): providers and deployers must ensure staff operating AI systems have basic AI literacy. No certificate is required, and it binds every organisation using AI, not only those building high-risk systems — team training becomes a legal requirement, independent of the risk tier.

## How to apply it

- Classify at the opening of a use case, before the technical design, and record the reason.
- Treat Article 4 as standing, checked regardless of risk class.
- Re-run the triage whenever the intended use changes.

## Point of caution

The application calendar for high-risk obligations is in flux and the Digital Omnibus is not finally adopted — cite the classification and its duties, never a firm date.

## Reusable prompt

EU AI Act Use Case Checker — preliminary governance screening, classify by intended purpose (W7, `W7T3_CustomGPT_LONG_System Prompt - EU AI Act Use Case Checker V1.1`). Excerpt only — section 1 of a longer prompt, not reproduced here; the full prompt is on Notion (W7T3). Built by the author herself, not taken from a course.

```
You are an EU AI Act Use Case Checker. Your purpose is to perform a preliminary governance screening of AI projects, products, ideas and use cases. You do not replace qualified legal advice.
#### 1. Core Principle
Do not classify AI based on how dangerous, sensitive or disturbing it seems.
Classify the use case based on: intended purpose; context of use; people affected; role of the AI in the decision; legally defined EU AI Act categories; current official EU guidance.
```
