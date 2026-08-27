---
id: cas-handshake
title: "Handshake — end-to-end governed AI workflow"
type: case
section: cases
order: 2
status: valid
crosscutting: []
lang: en
translations: []
proves: [gov-boucle-cx, gov-equite-segment, gov-responsible-ai]
sources:
  - titre: "README Handshake — 19 August, final"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-19
    nature: projet
    url: null
  - titre: "Playbook AI Governance"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-14
    nature: playbook
    url: null
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: "Synthetic test accounts (count reported between 9 and 12 depending on the source); deployed as a public demo, not in production."
links: [gov-boucle-cx, gov-equite-segment, gov-responsible-ai]
portfolio: oui
summary: "A complete end-to-end workflow: needs discovery, agent configuration, segment-level measurement, feedback loop."
---

## Context

Handshake is a CX-led AI governance framework built around Wardenly, a fictional B2B cybersecurity company. Its thesis: CX and CSM can act as the operational observability layer of AI governance, not only as stakeholders of it. The account data is synthetic throughout, extended from an earlier scoring prototype with equity dimensions.

## What was done

A CSM note triggers a webhook, personal data is redacted by an LLM call, account context is pulled from Supabase, and two branches run in parallel: classification against six HLEG dimensions, and a dynamic minority check against the portfolio's own distribution. They merge into two fields, needs_human_review and equity_watch, and every signal is written to Notion. The frontend is live and public at mandlspr.github.io/handshake, in German, English and French.

## Result

The final architecture has a single view. The Internal/Client toggle was removed on 19.08: the tool is entirely internal to the CSM, and the client-facing separation lives in the documents produced — a client QBR against an internal governance report — not in the frontend. That is a structural correction, not a cosmetic one. Testing covered every confidence combination, fairness with a minority and with a majority, three note languages, and five to six HLEG dimensions in real output. Sources disagree on the account count: the final README records nine to eleven accounts tested, the Playbook a twelve-account dataset.
