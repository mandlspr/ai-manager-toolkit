import { getCollection, type CollectionEntry } from "astro:content";
import {
  LANGUES,
  LANGUE_CANONIQUE,
  T,
  type Langue,
} from "../i18n/ui";

export type Entry = CollectionEntry<"entries">;

// Repères de bloc language-neutral (brief §2, §6) : le préfixe de cote.
// L'icône est rendue par src/components/BlocIcon.astro (line-art monochrome).
// Les libellés et descriptions traduits vivent dans i18n/ui.ts.
export const BLOCS = {
  gouvernance: { prefixe: "GOV" },
  prompts: { prefixe: "PRM" },
  build: { prefixe: "BLD" },
  evaluation: { prefixe: "EVL" },
  cas: { prefixe: "CAS" },
} as const;

export type BlocId = keyof typeof BLOCS;

export const BLOC_ORDER = [
  "gouvernance",
  "prompts",
  "build",
  "evaluation",
  "cas",
] as const satisfies readonly BlocId[];

// Le schéma de contenu est déclaré en JS (schema.mjs) : Astro type `bloc` comme
// `string`. Ces accès recentrent le typage sans `any`.
export function blocMeta(bloc: string) {
  return BLOCS[bloc as BlocId];
}
export function blocRank(bloc: string): number {
  return (BLOC_ORDER as readonly string[]).indexOf(bloc);
}
export function blocLabel(lang: Langue, bloc: string): string {
  return T[lang].bloc[bloc as BlocId].label;
}
export function blocDescription(lang: Langue, bloc: string): string {
  return T[lang].bloc[bloc as BlocId].description;
}

/**
 * Fiches visibles. Règle d'affichage du brief §3 : `statut: brouillon` est
 * visible en dev mais exclu du build de production.
 */
export async function getPublishedEntries(): Promise<Entry[]> {
  const all = await getCollection("entries");
  const visibles = all.filter((e) =>
    import.meta.env.PROD ? e.data.statut !== "brouillon" : true,
  );
  return visibles.sort(
    (a, b) =>
      blocRank(a.data.bloc) - blocRank(b.data.bloc) ||
      a.data.ordre - b.data.ordre,
  );
}

/** Fiches canoniques (EN) publiées — la référence pour toutes les langues. */
export async function getCanonicalEntries(): Promise<Entry[]> {
  const all = await getPublishedEntries();
  return all.filter((e) => e.data.lang === LANGUE_CANONIQUE);
}

/**
 * Résout la fiche à servir pour `canonicalId` dans `lang`. Si aucune version
 * traduite n'existe, renvoie la version canonique (EN) avec `translated: false`
 * — le bandeau de bascule visible s'appuie là-dessus. Jamais de 404.
 */
export function resolveEntry(
  canonicalId: string,
  lang: Langue,
  published: Entry[],
): { entry: Entry; translated: boolean } {
  const traduite = published.find(
    (e) => e.data.id === canonicalId && e.data.lang === lang,
  );
  if (traduite) return { entry: traduite, translated: true };
  const canonique = published.find(
    (e) => e.data.id === canonicalId && e.data.lang === LANGUE_CANONIQUE,
  );
  // canonique existe toujours (getStaticPaths est bâti dessus)
  return { entry: canonique as Entry, translated: false };
}

/**
 * Taux de complétion par langue, calculé depuis les fiches réellement présentes.
 * Dénominateur = nombre de fiches canoniques (EN).
 */
export async function completionParLangue(): Promise<
  Record<Langue, { fait: number; total: number }>
> {
  const all = await getPublishedEntries();
  const total = all.filter((e) => e.data.lang === LANGUE_CANONIQUE).length;
  const out = {} as Record<Langue, { fait: number; total: number }>;
  for (const l of LANGUES) {
    out[l] = { fait: all.filter((e) => e.data.lang === l).length, total };
  }
  return out;
}

/** Cote de rangement : préfixe du bloc + ordre sur deux chiffres (ex. GOV·02). */
export function cote(e: Entry): string {
  return `${blocMeta(e.data.bloc).prefixe}·${String(e.data.ordre).padStart(2, "0")}`;
}

/**
 * Badge « à revoir » calculé automatiquement (brief §3) : vérification de plus
 * de 6 mois.
 */
export function aReVoir(date: Date, now: Date = new Date()): boolean {
  const seuil = new Date(now);
  seuil.setMonth(seuil.getMonth() - 6);
  return date.getTime() < seuil.getTime();
}

const LOCALE_TAG: Record<Langue, string> = {
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
};
export function fmtDate(d: Date, lang: Langue = LANGUE_CANONIQUE): string {
  return new Intl.DateTimeFormat(LOCALE_TAG[lang], { dateStyle: "long" }).format(
    d,
  );
}

// --- liens croisés bidirectionnels ------------------------------------------
// Le lien inverse (principe → cas qui le prouvent) est CALCULÉ, jamais saisi
// dans le frontmatter (brief §5).

export function casQuiProuvent(principe: Entry, all: Entry[]): Entry[] {
  return all.filter(
    (e) =>
      e.data.type === "cas" && (e.data.prouve ?? []).includes(principe.data.id),
  );
}

export function principesProuves(cas: Entry, all: Entry[]): Entry[] {
  const ids = new Set(cas.data.prouve ?? []);
  return all.filter((e) => ids.has(e.data.id));
}

export function fichesLiees(entry: Entry, all: Entry[]): Entry[] {
  const ids = new Set(entry.data.liens ?? []);
  return all.filter((e) => ids.has(e.data.id) && e.data.id !== entry.data.id);
}
