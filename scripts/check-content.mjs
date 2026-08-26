#!/usr/bin/env node
// Content validation gate — brief, section 3 ("the build fails if ...").
//
//   node scripts/check-content.mjs              -> validates src/content/entries/**/*.md
//   node scripts/check-content.mjs --self-test  -> proves each rule actually fails
//
// Wired at the front of `npm run build`: any violation interrupts the build (exit 1).
// Astro (`astro sync` / `astro build`) revalidates on its side via src/content.config.ts;
// this script adds the cross-card integrity pass and plain-language messages.

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
  return path.length ? path.join(".") : "(root)";
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
      errors.push({ fiche: ref, message: `unreadable YAML frontmatter: ${e.message}` });
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
    console.log("✔ Content — skeleton ready, 0 cards yet.");
  } else {
    console.log(
      `✔ Content — ${validated.length}/${files.length} card(s) valid, ` +
        "cross-links OK.",
    );
  }
}

function reportErrors(errors) {
  const byFile = new Map();
  for (const { fiche, message } of errors) {
    if (!byFile.has(fiche)) byFile.set(fiche, []);
    byFile.get(fiche).push(message);
  }
  console.error(`\n✖ Content validation — ${errors.length} error(s)\n`);
  for (const [fiche, messages] of byFile) {
    console.error(`  ${fiche}`);
    for (const m of messages) console.error(`    - ${m}`);
  }
  console.error("\nBuild interrupted.\n");
}

// --------------------------------------------------------------------------
// Self-test: each "the build fails if ..." rule from the brief must actually
// fail validation. Plain fixtures, no card file created.

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
    par: "cross review + manual reread",
    perimetre_limite: null,
  };
  const principeValide = {
    id: "gov-double-test",
    titre: "Double-test before deciding",
    type: "principe",
    bloc: "gouvernance",
    ordre: 1,
    statut: "valide",
    transverses: ["tracabilite"],
    lang: "en",
    traductions: [],
    sources: [sourceProjet],
    verification: verificationOk,
    liens: [],
    portfolio: "oui",
    resume: "One sentence.",
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
    ["baseline — valid principe", principeValide, true],
    ["rule: empty sources", { ...principeValide, sources: [] }, false],
    [
      "rule: externe source without url",
      {
        ...principeValide,
        sources: [{ ...sourceProjet, nature: "externe", url: null }],
      },
      false,
    ],
    [
      "rule: missing verification.date",
      {
        ...principeValide,
        verification: { par: "x", perimetre_limite: null },
      },
      false,
    ],
    ["rule: missing ordre", { ...principeValide, ordre: undefined }, false],
    ["rule: ordre <= 0", { ...principeValide, ordre: 0 }, false],
    ["rule: type cas without prouve", { ...casValide, prouve: undefined }, false],
    [
      "rule: type principe with prouve",
      { ...principeValide, prouve: ["gov-x"] },
      false,
    ],
    ["baseline — valid cas (with prouve)", casValide, true],
  ];

  let failed = 0;
  for (const [name, input, shouldPass] of schemaCases) {
    const ok = entryFrontmatterSchema.safeParse(input).success;
    const good = ok === shouldPass;
    if (!good) failed++;
    console.log(
      `${good ? "✔" : "✖"} ${name} — expected ` +
        `${shouldPass ? "valid" : "rejected"}, got ${ok ? "valid" : "rejected"}`,
    );
  }

  // rule: unknown id in liens/prouve (cross-card integrity pass)
  const crossRefErrors = checkCrossReferences([
    { ref: "A", data: { ...entryFrontmatterSchema.parse(principeValide), liens: ["ghost-card"] } },
  ]);
  const crossRefGood = crossRefErrors.length > 0;
  if (!crossRefGood) failed++;
  console.log(
    `${crossRefGood ? "✔" : "✖"} rule: unknown id in liens/prouve — ` +
      `expected rejected, got ${crossRefGood ? "rejected" : "accepted"}`,
  );

  // uniqueness of (id, lang)
  const dupErrors = checkCrossReferences([
    { ref: "A", data: entryFrontmatterSchema.parse(principeValide) },
    { ref: "B", data: entryFrontmatterSchema.parse(principeValide) },
  ]);
  const dupGood = dupErrors.some((e) => /already defined/.test(e.message));
  if (!dupGood) failed++;
  console.log(
    `${dupGood ? "✔" : "✖"} rule: duplicate (id, lang) — ` +
      `expected rejected, got ${dupGood ? "rejected" : "accepted"}`,
  );

  // uniqueness of ordre per bloc
  const ordre2 = { ...principeValide, id: "gov-other", ordre: 1 };
  const ordreErrors = checkCrossReferences([
    { ref: "A", data: entryFrontmatterSchema.parse(principeValide) },
    { ref: "B", data: entryFrontmatterSchema.parse(ordre2) },
  ]);
  const ordreGood = ordreErrors.some((e) => /ordre.*already used/.test(e.message));
  if (!ordreGood) failed++;
  console.log(
    `${ordreGood ? "✔" : "✖"} rule: duplicate ordre in bloc — ` +
      `expected rejected, got ${ordreGood ? "rejected" : "accepted"}`,
  );

  // prouve pointing to a cas instead of a principe
  const casQuiProuveUnCas = { ...casValide, id: "cas-bad", prouve: ["cas-x"] };
  const casAutre = { ...casValide, id: "cas-x", ordre: 2 };
  const prouveErrors = checkCrossReferences([
    { ref: "A", data: entryFrontmatterSchema.parse(casQuiProuveUnCas) },
    { ref: "B", data: entryFrontmatterSchema.parse(casAutre) },
  ]);
  const prouveGood = prouveErrors.some((e) => /is not a type: principe/.test(e.message));
  if (!prouveGood) failed++;
  console.log(
    `${prouveGood ? "✔" : "✖"} rule: prouve pointing to a non-principe cas — ` +
      `expected rejected, got ${prouveGood ? "rejected" : "accepted"}`,
  );

  if (failed) {
    console.error(`\n✖ ${failed} self-test case(s) failed.\n`);
    process.exit(1);
  }
  console.log(
    "\n✔ Self-test OK — 7 brief rules + cross-card integrity all fail validation as expected.",
  );
}

// --------------------------------------------------------------------------

if (process.argv.includes("--self-test")) runSelfTest();
else runCheck();
