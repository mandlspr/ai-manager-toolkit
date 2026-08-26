#!/usr/bin/env node
// Portail de validation du contenu — brief, section 3 (« le build échoue si … »).
//
//   node scripts/check-content.mjs              → valide src/content/entries/**/*.md
//   node scripts/check-content.mjs --self-test  → prouve que chaque règle casse bien
//
// Câblé en tête de `npm run build` : toute violation interrompt le build (exit 1).
// Astro (`astro sync` / `astro build`) revalide de son côté via src/content.config.ts ;
// ce script ajoute la passe d'intégrité inter-fiches et des messages en clair.

import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  entryFrontmatterSchema,
  checkCrossReferences,
} from "../src/content/schema.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ENTRIES_DIR = join(ROOT, "src/content/entries");

// --------------------------------------------------------------------------

function walkMarkdown(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walkMarkdown(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

function formatIssuePath(path) {
  return path.length ? path.join(".") : "(racine)";
}

// --------------------------------------------------------------------------

function runCheck() {
  const files = walkMarkdown(ENTRIES_DIR).sort();
  const errors = []; // { fiche, message }
  const validated = []; // { ref, data }

  for (const file of files) {
    const ref = relative(ROOT, file);
    let frontmatter;
    try {
      frontmatter = matter(readFileSync(file, "utf8")).data;
    } catch (e) {
      errors.push({ fiche: ref, message: `frontmatter YAML illisible : ${e.message}` });
      continue;
    }
    const parsed = entryFrontmatterSchema.safeParse(frontmatter);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          fiche: ref,
          message: `${formatIssuePath(issue.path)} — ${issue.message}`,
        });
      }
      continue;
    }
    validated.push({ ref, data: parsed.data });
  }

  errors.push(...checkCrossReferences(validated));

  if (errors.length) {
    reportErrors(errors);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log(
      "✔ Contenu — squelette prêt, 0 fiche pour l'instant " +
        "(les 24 fiches arrivent à l'étape 2 du brief).",
    );
  } else {
    console.log(
      `✔ Contenu — ${validated.length}/${files.length} fiche(s) valide(s), ` +
        "intégrité des liens croisés OK.",
    );
  }
}

function reportErrors(errors) {
  const byFile = new Map();
  for (const { fiche, message } of errors) {
    if (!byFile.has(fiche)) byFile.set(fiche, []);
    byFile.get(fiche).push(message);
  }
  console.error(`\n✖ Validation du contenu — ${errors.length} erreur(s)\n`);
  for (const [fiche, messages] of byFile) {
    console.error(`  ${fiche}`);
    for (const m of messages) console.error(`    - ${m}`);
  }
  console.error("\nLe build est interrompu.\n");
}

// --------------------------------------------------------------------------
// Self-test : chacune des 5 règles « le build échoue si … » du brief doit
// effectivement faire échouer la validation. Fixtures en clair, aucun fichier
// de fiche créé.

function runSelfTest() {
  const sourceProjet = {
    titre: "StackFit V1 — Handshake Project Log",
    emplacement: "Projet Claude / AI Manager Toolkit",
    date_document: "2026-08-14",
    nature: "projet",
    url: null,
  };
  const verificationOk = {
    date: "2026-08-25",
    par: "revue croisée + relecture manuelle",
    perimetre_limite: null,
  };
  const principeValide = {
    id: "gov-double-test",
    titre: "Double-test avant décision",
    type: "principe",
    bloc: "gouvernance",
    ordre: 1,
    statut: "valide",
    transverses: ["tracabilite"],
    lang: "fr",
    traductions: [],
    sources: [sourceProjet],
    verification: verificationOk,
    liens: [],
    portfolio: "oui",
    resume: "Une phrase.",
  };
  const casValide = {
    ...principeValide,
    id: "cas-stackfit",
    type: "cas",
    bloc: "cas",
    ordre: 1,
    prouve: ["gov-double-test"],
  };

  const schemaCases = [
    ["baseline — principe valide", principeValide, true],
    ["règle : sources vide", { ...principeValide, sources: [] }, false],
    [
      "règle : source externe sans url",
      {
        ...principeValide,
        sources: [{ ...sourceProjet, nature: "externe", url: null }],
      },
      false,
    ],
    [
      "règle : verification.date absente",
      {
        ...principeValide,
        verification: { par: "x", perimetre_limite: null },
      },
      false,
    ],
    ["règle : ordre absent", { ...principeValide, ordre: undefined }, false],
    ["règle : ordre <= 0", { ...principeValide, ordre: 0 }, false],
    ["règle : type cas sans prouve", { ...casValide, prouve: undefined }, false],
    [
      "règle : type principe avec prouve",
      { ...principeValide, prouve: ["gov-x"] },
      false,
    ],
    ["baseline — cas valide (avec prouve)", casValide, true],
  ];

  let failed = 0;
  for (const [name, input, shouldPass] of schemaCases) {
    const ok = entryFrontmatterSchema.safeParse(input).success;
    const good = ok === shouldPass;
    if (!good) failed++;
    console.log(
      `${good ? "✔" : "✖"} ${name} — attendu ` +
        `${shouldPass ? "valide" : "rejeté"}, obtenu ${ok ? "valide" : "rejeté"}`,
    );
  }

  // règle : id dans liens/prouve inconnu (passe d'intégrité inter-fiches)
  const crossRefErrors = checkCrossReferences([
    { ref: "A", data: { ...entryFrontmatterSchema.parse(principeValide), liens: ["fiche-fantome"] } },
  ]);
  const crossRefGood = crossRefErrors.length > 0;
  if (!crossRefGood) failed++;
  console.log(
    `${crossRefGood ? "✔" : "✖"} règle : id inconnu dans liens/prouve — ` +
      `attendu rejeté, obtenu ${crossRefGood ? "rejeté" : "accepté"}`,
  );

  // unicité (id, lang)
  const dupErrors = checkCrossReferences([
    { ref: "A", data: entryFrontmatterSchema.parse(principeValide) },
    { ref: "B", data: entryFrontmatterSchema.parse(principeValide) },
  ]);
  const dupGood = dupErrors.some((e) => /déjà défini/.test(e.message));
  if (!dupGood) failed++;
  console.log(
    `${dupGood ? "✔" : "✖"} règle : (id, lang) en double — ` +
      `attendu rejeté, obtenu ${dupGood ? "rejeté" : "accepté"}`,
  );

  // unicité de ordre par bloc
  const ordre2 = { ...principeValide, id: "gov-autre", ordre: 1 };
  const ordreErrors = checkCrossReferences([
    { ref: "A", data: entryFrontmatterSchema.parse(principeValide) },
    { ref: "B", data: entryFrontmatterSchema.parse(ordre2) },
  ]);
  const ordreGood = ordreErrors.some((e) => /ordre.*déjà utilisé/.test(e.message));
  if (!ordreGood) failed++;
  console.log(
    `${ordreGood ? "✔" : "✖"} règle : ordre dupliqué dans bloc — ` +
      `attendu rejeté, obtenu ${ordreGood ? "rejeté" : "accepté"}`,
  );

  // prouve pointe vers un cas au lieu d'un principe
  const casQuiProuveUnCas = { ...casValide, id: "cas-mauvais", prouve: ["cas-x"] };
  const casAutre = { ...casValide, id: "cas-x", ordre: 2 };
  const prouveErrors = checkCrossReferences([
    { ref: "A", data: entryFrontmatterSchema.parse(casQuiProuveUnCas) },
    { ref: "B", data: entryFrontmatterSchema.parse(casAutre) },
  ]);
  const prouveGood = prouveErrors.some((e) => /prouve.*n'est pas.*principe/.test(e.message));
  if (!prouveGood) failed++;
  console.log(
    `${prouveGood ? "✔" : "✖"} règle : prouve vers un cas non-principe — ` +
      `attendu rejeté, obtenu ${prouveGood ? "rejeté" : "accepté"}`,
  );

  if (failed) {
    console.error(`\n✖ ${failed} cas de self-test en échec.\n`);
    process.exit(1);
  }
  console.log(
    "\n✔ Self-test OK — 7 règles du brief + intégrité inter-fiches cassent bien la validation.",
  );
}

// --------------------------------------------------------------------------

if (process.argv.includes("--self-test")) runSelfTest();
else runCheck();
