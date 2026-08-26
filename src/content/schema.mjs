// Schéma de contenu — source de vérité : BRIEF_BUILD_Toolkit.md, section 3.
//
// Ce fichier est volontairement en JS (pas TS) et n'importe QUE `zod` :
// il est partagé tel quel par
//   - src/content.config.ts        (validation native Astro au build / `astro sync`)
//   - scripts/check-content.mjs     (portail de validation qui casse `npm run build`)
//
// Toute règle « le build échoue si … » du brief (section 3) est implémentée ici
// ou dans la passe d'intégrité inter-fiches ci-dessous.

import { z } from "zod";

// --- énumérations du brief ---------------------------------------------------

export const BLOCS = ["gouvernance", "prompts", "build", "evaluation", "cas"];
export const TYPES = ["principe", "cas"];
export const STATUTS = ["valide", "a-resourcer", "brouillon"];
export const TRANSVERSES = ["cout", "hitl", "tracabilite"];
export const LANGS = ["fr", "de", "en"];
export const NATURES_SOURCE = ["projet", "notebook", "playbook", "externe"];
export const PORTFOLIO = ["oui", "non", "pas-encore"];

// --- sous-schéma : une source ---------------------------------------------------

const sourceSchema = z
  .object({
    titre: z.string().min(1),
    emplacement: z.string().min(1),
    date_document: z.coerce.date(),
    nature: z.enum(NATURES_SOURCE),
    // `url` obligatoire uniquement si nature = externe (vérifié plus bas).
    url: z.string().url().nullable().default(null),
  })
  .strict();

// --- sous-schéma : vérification ------------------------------------------------

const verificationSchema = z
  .object({
    // Règle brief : le build échoue si `verification.date` est absent.
    date: z.coerce.date({
      required_error: "verification.date est obligatoire",
      invalid_type_error: "verification.date doit être une date (AAAA-MM-JJ)",
    }),
    par: z.string().min(1),
    // Texte si un angle mort connu subsiste, sinon null.
    perimetre_limite: z.string().min(1).nullable().default(null),
  })
  .strict();

// --- schéma principal d'une fiche --------------------------------------------

export const entryFrontmatterSchema = z
  .object({
    // id stable, jamais renommé — les liens croisés en dépendent.
    id: z
      .string()
      .min(1)
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "id en kebab-case minuscule (ex. gov-double-test)",
      ),
    titre: z.string().min(1),
    type: z.enum(TYPES),
    bloc: z.enum(BLOCS),
    ordre: z.coerce.number().int().positive({
      message: "ordre doit être un entier positif (unique par bloc)",
    }),
    statut: z.enum(STATUTS),
    transverses: z.array(z.enum(TRANSVERSES)).default([]),
    lang: z.enum(LANGS),
    traductions: z.array(z.enum(LANGS)).default([]),

    sources: z
      .array(sourceSchema)
      // Règle brief : le build échoue si `sources` est vide.
      .min(1, "au moins une source est obligatoire"),

    verification: verificationSchema,

    // Liens croisés (ids de fiches). L'existence des ids est vérifiée par la
    // passe d'intégrité inter-fiches (checkCrossReferences), pas ici : le schéma
    // par-fiche n'a pas connaissance de la collection complète.
    liens: z.array(z.string().min(1)).default([]),

    // Présent UNIQUEMENT pour type: cas — ids des principes illustrés.
    prouve: z.array(z.string().min(1)).optional(),

    portfolio: z.enum(PORTFOLIO),
    resume: z.string().min(1),
  })
  .strict()
  .superRefine((data, ctx) => {
    // Règle brief : une source `externe` doit avoir une `url`.
    data.sources.forEach((s, i) => {
      if (s.nature === "externe" && !s.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sources", i, "url"],
          message: "url obligatoire quand nature = externe",
        });
      }
    });

    // Règle brief : une fiche `type: cas` DOIT avoir un champ `prouve` non vide.
    if (data.type === "cas") {
      if (!Array.isArray(data.prouve) || data.prouve.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["prouve"],
          message:
            "une fiche type: cas doit déclarer `prouve` (ids des principes illustrés)",
        });
      }
    }

    // Règle brief : une fiche `type: principe` NE DOIT PAS avoir de champ `prouve`.
    if (data.type === "principe" && data.prouve !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["prouve"],
        message: "une fiche type: principe ne peut pas porter de champ `prouve`",
      });
    }
  });

// --- intégrité inter-fiches -------------------------------------------------------
//
// Prend la liste des fiches déjà validées individuellement et vérifie ce que le
// schéma par-fiche ne peut pas voir. Retourne un tableau d'erreurs
// { fiche, message } ; vide = OK.
//
// `entries` : Array<{ ref: string, data: <frontmatter validé> }>
//   `ref` sert seulement à situer l'erreur (chemin de fichier, id…).

export function checkCrossReferences(entries) {
  const errors = [];
  const push = (ref, message) => errors.push({ fiche: ref, message });

  // 1. unicité de (id, lang) — un même id est autorisé sur plusieurs langues,
  //    jamais deux fois sur la même.
  const seen = new Map(); // `${id}::${lang}` -> ref
  for (const { ref, data } of entries) {
    const key = `${data.id}::${data.lang}`;
    if (seen.has(key)) {
      push(ref, `id « ${data.id} » (lang ${data.lang}) déjà défini dans ${seen.get(key)}`);
    } else {
      seen.set(key, ref);
    }
  }

  // 2. unicité de `ordre` par bloc (version FR canonique uniquement).
  const ordreParBloc = new Map(); // `${bloc}::${ordre}` -> ref
  for (const { ref, data } of entries) {
    // On ne vérifie l'unicité que sur la version FR canonique.
    if (data.lang !== "fr") continue;
    const key = `${data.bloc}::${data.ordre}`;
    if (ordreParBloc.has(key)) {
      push(
        ref,
        `ordre ${data.ordre} déjà utilisé dans le bloc « ${data.bloc} » (${ordreParBloc.get(key)})`,
      );
    } else {
      ordreParBloc.set(key, ref);
    }
  }

  const idsConnus = new Set(entries.map((e) => e.data.id));
  // Map id -> type pour vérifier que `prouve` pointe vers des principes
  const typeParId = new Map(entries.map((e) => [e.data.id, e.data.type]));

  // 3. tout id cité dans `liens` doit correspondre à une fiche existante.
  for (const { ref, data } of entries) {
    for (const cible of data.liens ?? []) {
      if (!idsConnus.has(cible)) {
        push(ref, `liens → « ${cible} » ne correspond à aucune fiche`);
      }
    }

    // 4. tout id cité dans `prouve` doit :
    //    a) correspondre à une fiche existante
    //    b) être une fiche `type: principe`
    for (const cible of data.prouve ?? []) {
      if (!idsConnus.has(cible)) {
        push(ref, `prouve → « ${cible} » ne correspond à aucune fiche`);
      } else if (typeParId.get(cible) !== "principe") {
        push(
          ref,
          `prouve → « ${cible} » n'est pas une fiche type: principe (c'est un ${typeParId.get(cible)})`,
        );
      }
    }
  }

  return errors;
}
