---
id: bld-debug-export
title: "Debugging via structured export"
type: principle
section: build
order: 4
status: valid
crosscutting: [hitl]
lang: en
translations: []
sources:
  - titre: "Notebook W5"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-25
    nature: notebook
    url: null
  - titre: "audit/prompt_enrichment.json"
    emplacement: "Projet Claude / AI Manager Toolkit"
    date_document: 2026-08-29
    nature: notebook
    url: null
verified:
  date: 2026-08-25
  by: "revue croisée ChatGPT + relecture manuelle"
  scope_limit: null
links: []
portfolio: oui
summary: "Export traces, tool calls, and model decisions as JSON — a reliable way to diagnose failures."
---

## Principle

To debug a workflow, hand the reviewing model the workflow's source — the exported JSON — rather than screenshots. Formal, structured languages carry almost no ambiguity, so a model can read the nodes, their identifiers and their connections and criticise the structure surgically. A screenshot shows a picture of the flow; the export is the flow.

## Why it matters

The export surfaces errors that are invisible on the canvas: an agent node used with no tools and no memory where a plain LLM chain would do, a misconfigured recipient field, a prompt buried inside a node that nobody re-reads. Those are structural mistakes, and a visual review has no way to reach them.

## How to apply it

- Export the workflow to JSON and ask for a constructive critique, explicitly including the prompt inside the agent node.
- Ask for the corrected JSON back, then re-import it.
- Validate and adjust variables and placeholders after import, and test the flow — the reviewing model does not know the actual columns of your external sources.
- Strip personal data before sharing an export: credentials themselves are not included, but credential names are.

## Point of caution

A model can review a flow and flag security weaknesses; it cannot replace live testing.

## Reusable prompt

Workflow critique via JSON export — paste an n8n workflow file and ask for a constructive review, including the inner agent prompt (W5, `W5T3_Cours_Optimiser un n8n flow avec l'IA`).

```
J'ai un workflow n8n dont voici le fichier JSON en piece jointe. Analyse-le et fais-moi une critique constructive : qu'est-ce qui pourrait etre ameliore ? Critique notamment le prompt a l'interieur de l'agent et propose-moi une version optimisee.
```

Governance note: never include real API keys or PII in the submitted JSON — credentials are not exported, but their names are. Limit: the model reasons about the formal structure, not the real content of external data sources.
