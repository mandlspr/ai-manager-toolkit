// Content schema — source of truth: BRIEF_BUILD_Toolkit.md, section 3.
//
// This file is intentionally JS (not TS) and imports ONLY `zod`:
// it is shared as-is by
//   - src/content.config.ts        (native Astro validation at build / `astro sync`)
//   - scripts/check-content.mjs     (validation gate that fails `npm run build`)
//
// Every "the build fails if ..." rule from the brief (section 3) is implemented
// here or in the cross-card integrity pass below.

import { z } from "zod";

// --- brief enumerations ----------------------------------------------------

export const BLOCS = ["gouvernance", "prompts", "build", "evaluation", "cas"];
export const TYPES = ["principe", "cas"];
export const STATUTS = ["valide", "a-resourcer", "brouillon"];
export const TRANSVERSES = ["cout", "hitl", "tracabilite"];
export const LANGS = ["fr", "de", "en"];
export const NATURES_SOURCE = ["projet", "notebook", "playbook", "externe"];
export const PORTFOLIO = ["oui", "non", "pas-encore"];

// --- sub-schema: a single source -----------------------------------------------

const sourceSchema = z
  .object({
    titre: z.string().min(1),
    emplacement: z.string().min(1),
    date_document: z.coerce.date(),
    nature: z.enum(NATURES_SOURCE),
    // `url` is required only when nature = externe (checked further down).
    url: z.string().url().nullable().default(null),
  })
  .strict();

// --- sub-schema: verification ------------------------------------------------

const verificationSchema = z
  .object({
    // Brief rule: the build fails if `verification.date` is missing.
    date: z.coerce.date({
      required_error: "verification.date is required",
      invalid_type_error: "verification.date must be a date (YYYY-MM-DD)",
    }),
    par: z.string().min(1),
    // Text if a known blind spot remains, otherwise null.
    perimetre_limite: z.string().min(1).nullable().default(null),
  })
  .strict();

// --- main card schema ------------------------------------------------------

export const entryFrontmatterSchema = z
  .object({
    // Stable id, never renamed — cross-links depend on it.
    id: z
      .string()
      .min(1)
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "id must be lowercase kebab-case (e.g. gov-double-test)",
      ),
    titre: z.string().min(1),
    type: z.enum(TYPES),
    bloc: z.enum(BLOCS),
    ordre: z.coerce.number().int().positive({
      message: "ordre must be a positive integer (unique per bloc)",
    }),
    statut: z.enum(STATUTS),
    transverses: z.array(z.enum(TRANSVERSES)).default([]),
    lang: z.enum(LANGS),
    traductions: z.array(z.enum(LANGS)).default([]),

    sources: z
      .array(sourceSchema)
      // Brief rule: the build fails if `sources` is empty.
      .min(1, "at least one source is required"),

    verification: verificationSchema,

    // Cross-links (card ids). Whether the ids exist is checked by the
    // cross-card integrity pass (checkCrossReferences), not here: the per-card
    // schema has no knowledge of the full collection.
    liens: z.array(z.string().min(1)).default([]),

    // Present ONLY for type: cas — ids of the principles it illustrates.
    prouve: z.array(z.string().min(1)).optional(),

    portfolio: z.enum(PORTFOLIO),
    resume: z.string().min(1),
  })
  .strict()
  .superRefine((data, ctx) => {
    // Brief rule: an `externe` source must have a `url`.
    data.sources.forEach((s, i) => {
      if (s.nature === "externe" && !s.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sources", i, "url"],
          message: "url is required when nature = externe",
        });
      }
    });

    // Brief rule: a `type: cas` card MUST have a non-empty `prouve` field.
    if (data.type === "cas") {
      if (!Array.isArray(data.prouve) || data.prouve.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["prouve"],
          message:
            "a type: cas card must declare `prouve` (ids of the principles it illustrates)",
        });
      }
    }

    // Brief rule: a `type: principe` card MUST NOT have a `prouve` field.
    if (data.type === "principe" && data.prouve !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["prouve"],
        message: "a type: principe card cannot carry a `prouve` field",
      });
    }
  });

// --- cross-card integrity -----------------------------------------------------
//
// Takes the list of cards already validated individually and checks what the
// per-card schema cannot see. Returns an array of errors
// { fiche, message }; empty = OK.
//
// `entries`: Array<{ ref: string, data: <validated frontmatter> }>
//   `ref` only serves to locate the error (file path, id...).

export function checkCrossReferences(entries) {
  const errors = [];
  const push = (ref, message) => errors.push({ fiche: ref, message });

  // 1. uniqueness of (id, lang) — a given id is allowed across several
  //    languages, never twice on the same one.
  const seen = new Map(); // `${id}::${lang}` -> ref
  for (const { ref, data } of entries) {
    const key = `${data.id}::${data.lang}`;
    if (seen.has(key)) {
      push(ref, `id "${data.id}" (lang ${data.lang}) already defined in ${seen.get(key)}`);
    } else {
      seen.set(key, ref);
    }
  }

  // 2. uniqueness of `ordre` per bloc (canonical EN version only).
  const ordreParBloc = new Map(); // `${bloc}::${ordre}` -> ref
  for (const { ref, data } of entries) {
    // Uniqueness is only checked on the canonical EN version.
    if (data.lang !== "en") continue;
    const key = `${data.bloc}::${data.ordre}`;
    if (ordreParBloc.has(key)) {
      push(
        ref,
        `ordre ${data.ordre} already used in bloc "${data.bloc}" (${ordreParBloc.get(key)})`,
      );
    } else {
      ordreParBloc.set(key, ref);
    }
  }

  const idsConnus = new Set(entries.map((e) => e.data.id));
  // Map id -> type, to check that `prouve` points to principles.
  const typeParId = new Map(entries.map((e) => [e.data.id, e.data.type]));

  // 3. every id cited in `liens` must match an existing card.
  for (const { ref, data } of entries) {
    for (const cible of data.liens ?? []) {
      if (!idsConnus.has(cible)) {
        push(ref, `liens -> "${cible}" matches no card`);
      }
    }

    // 4. every id cited in `prouve` must:
    //    a) match an existing card
    //    b) be a `type: principe` card
    for (const cible of data.prouve ?? []) {
      if (!idsConnus.has(cible)) {
        push(ref, `prouve -> "${cible}" matches no card`);
      } else if (typeParId.get(cible) !== "principe") {
        push(
          ref,
          `prouve -> "${cible}" is not a type: principe card (it is a ${typeParId.get(cible)})`,
        );
      }
    }
  }

  return errors;
}
