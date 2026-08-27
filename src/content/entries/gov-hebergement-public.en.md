---
id: gov-hebergement-public
title: "Minimum compliance before public hosting"
type: principle
section: governance
order: 11
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
portfolio: non
summary: "Verify legal, security, and data compliance before any public deployment — a minimum bar."
---

## Principle

Public hosting carries a legal minimum that is separate from the data-processing contract. Before anything is exposed publicly, a legal notice (Impressum) and a privacy policy (Datenschutzerklärung) must be in place. This is distinct from the data-processing agreement under Art. 28 GDPR, which covers a third party processing data on your behalf — having one does not satisfy the other.

## Why it matters

The two obligations are routinely collapsed into a single "compliance" step and then satisfied only on the processor side. A prototype moved from a local machine to a public URL becomes a published service, and server location itself carries weight in Germany and Europe for data protection, data leakage and digital sovereignty. The gap usually appears at the moment a demo becomes a link that can be sent to someone.

## How to apply it

- Treat "make it public" as a gate separate from "make it work".
- Put the legal notice and the privacy policy in place before the first public URL, not after the first visitor.
- Check where the host actually runs, not only who the host is.
- Keep the data-processing agreement question separate and answer it on its own terms.

## Point of caution
