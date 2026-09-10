---
id: evl-prompt-rag-finetune
title: "Prompt first, RAG second, fine-tuning last"
type: principle
section: evaluation
order: 5
status: valid
crosscutting: []
lang: en
translations: []
diagram: ifg-01-what-to-optimise
sources:
  - titre: "Notebook W2"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-19
    nature: notebook
    url: null
  - titre: "Notebook W5"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-25
    nature: notebook
    url: null
  - titre: "Notebook W7"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-08
    nature: notebook
    url: null
verified:
  date: 2026-08-29
  by: "revue croisée audit W1–W7 (29.08) + relecture manuelle"
  scope_limit: null
links: [gov-anti-hallucination, prm-3c]
portfolio: oui
summary: "Optimise in order — prompt, then RAG, then fine-tuning — and know the split: RAG adds facts, fine-tuning adds style. Fine-tuning adds no facts."
---

## Principle

Optimise a model in order: prompt engineering first, then RAG, then fine-tuning. Two axes separate the tools. What the model needs to *know* is a context problem — RAG connects it to an external knowledge base at inference time and adds facts without retraining. How it needs to *act* is a behaviour problem — fine-tuning continues training on curated input-output pairs and fixes style, tone and format. Fine-tuning adds no facts.

## Why it matters

The costly move is "let's fine-tune the model so it knows our catalogue". It does not work: fine-tuning teaches behaviour, not knowledge, and it is a slow, data-hungry loop. A catalogue that changes is a retrieval problem; reaching for the heaviest tool first burns weeks of data prep on what a retriever would have delivered.

## How to apply it

- Start with a systematic error analysis, before changing anything.
- Set a baseline with prompt engineering, then add RAG when the model needs current facts it is hallucinating.
- Fine-tune only for a persistent style or format need — or combine both for a domain expert system.

## Point of caution

This ordering is the one framework corroborated by three independent weeks. The "50 documents" RAG break-even sometimes quoted is called arbitrary in the source itself — do not cite it.
