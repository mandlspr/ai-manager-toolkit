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

// --- enumerations --------------------------------------------------------

export const SECTIONS = ["governance", "prompts", "build", "evaluation", "cases"];
export const TYPES = ["principle", "case"];
export const STATUSES = ["valid", "to-resource", "draft"];
// Cross-cutting axis values are kept as-is (not part of the data-vocabulary rename).
export const CROSSCUTTING = ["cout", "hitl", "tracabilite"];
export const LANGS = ["fr", "de", "en"];
export const NATURES_SOURCE = ["projet", "notebook", "playbook", "externe"];
export const PORTFOLIO = ["oui", "non", "pas-encore"];

// --- sub-schema: a single source -----------------------------------------------
// `sources` and its item shape are left unchanged.

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

// --- sub-schema: verified ------------------------------------------------

const verifiedSchema = z
  .object({
    // Brief rule: the build fails if `verified.date` is missing.
    date: z.coerce.date({
      required_error: "verified.date is required",
      invalid_type_error: "verified.date must be a date (YYYY-MM-DD)",
    }),
    by: z.string().min(1),
    // Text if a known blind spot remains, otherwise null.
    scope_limit: z.string().min(1).nullable().default(null),
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
    title: z.string().min(1),
    type: z.enum(TYPES),
    section: z.enum(SECTIONS),
    order: z.coerce.number().int().positive({
      message: "order must be a positive integer (unique per section)",
    }),
    status: z.enum(STATUSES),
    crosscutting: z.array(z.enum(CROSSCUTTING)).default([]),
    lang: z.enum(LANGS),
    translations: z.array(z.enum(LANGS)).default([]),

    sources: z
      .array(sourceSchema)
      // Brief rule: the build fails if `sources` is empty.
      .min(1, "at least one source is required"),

    verified: verifiedSchema,

    // Cross-links (card ids). Whether the ids exist is checked by the
    // cross-card integrity pass (checkCrossReferences), not here: the per-card
    // schema has no knowledge of the full collection.
    links: z.array(z.string().min(1)).default([]),

    // Present ONLY for type: case — ids of the principles it illustrates.
    proves: z.array(z.string().min(1)).optional(),

    portfolio: z.enum(PORTFOLIO),
    summary: z.string().min(1),
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

    // Brief rule: a `type: case` card MUST have a non-empty `proves` field.
    if (data.type === "case") {
      if (!Array.isArray(data.proves) || data.proves.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["proves"],
          message:
            "a type: case card must declare `proves` (ids of the principles it illustrates)",
        });
      }
    }

    // Brief rule: a `type: principle` card MUST NOT have a `proves` field.
    if (data.type === "principle" && data.proves !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["proves"],
        message: "a type: principle card cannot carry a `proves` field",
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

  // 2. uniqueness of `order` per section (canonical EN version only).
  const orderPerSection = new Map(); // `${section}::${order}` -> ref
  for (const { ref, data } of entries) {
    // Uniqueness is only checked on the canonical EN version.
    if (data.lang !== "en") continue;
    const key = `${data.section}::${data.order}`;
    if (orderPerSection.has(key)) {
      push(
        ref,
        `order ${data.order} already used in section "${data.section}" (${orderPerSection.get(key)})`,
      );
    } else {
      orderPerSection.set(key, ref);
    }
  }

  const knownIds = new Set(entries.map((e) => e.data.id));
  // Map id -> type, to check that `proves` points to principles.
  const typeById = new Map(entries.map((e) => [e.data.id, e.data.type]));

  // 3. every id cited in `links` must match an existing card.
  for (const { ref, data } of entries) {
    for (const target of data.links ?? []) {
      if (!knownIds.has(target)) {
        push(ref, `links -> "${target}" matches no card`);
      }
    }

    // 4. every id cited in `proves` must:
    //    a) match an existing card
    //    b) be a `type: principle` card
    for (const target of data.proves ?? []) {
      if (!knownIds.has(target)) {
        push(ref, `proves -> "${target}" matches no card`);
      } else if (typeById.get(target) !== "principle") {
        push(
          ref,
          `proves -> "${target}" is not a type: principle card (it is a ${typeById.get(target)})`,
        );
      }
    }
  }

  return errors;
}
