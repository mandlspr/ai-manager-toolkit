import { getCollection, type CollectionEntry } from "astro:content";
import {
  LANGUES,
  LANGUE_CANONIQUE,
  T,
  type Langue,
} from "../i18n/ui";

export type Entry = CollectionEntry<"entries">;

// Language-neutral bloc markers (brief §2, §6): the shelf-code prefix.
// The icon is rendered by src/components/BlocIcon.astro (monochrome line-art).
// Translated labels and descriptions live in i18n/ui.ts.
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

// The content schema is declared in JS (schema.mjs), so Astro types `bloc` as
// `string`. These accessors narrow the typing without `any`.
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
 * Visible cards. Display rule from brief §3: `statut: brouillon` is visible in
 * dev but excluded from the production build.
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

/** Published canonical (EN) cards — the reference for every language. */
export async function getCanonicalEntries(): Promise<Entry[]> {
  const all = await getPublishedEntries();
  return all.filter((e) => e.data.lang === LANGUE_CANONIQUE);
}

/**
 * Resolves the card to serve for `canonicalId` in `lang`. If no translated
 * version exists, returns the canonical (EN) version with `translated: false`
 * — the visible switch banner relies on this. Never a 404.
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
  // the canonical always exists (getStaticPaths is built from it)
  return { entry: canonique as Entry, translated: false };
}

/**
 * Completion rate per language, computed from the cards actually present.
 * Denominator = number of canonical (EN) cards.
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

/** Shelf code: bloc prefix + ordre on two digits (e.g. GOV·02). */
export function cote(e: Entry): string {
  return `${blocMeta(e.data.bloc).prefixe}·${String(e.data.ordre).padStart(2, "0")}`;
}

/**
 * "Review" badge, computed automatically (brief §3): verification older than
 * 6 months.
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

// --- bidirectional cross-links ---------------------------------------------
// The inverse link (principe -> cases that prove it) is COMPUTED, never entered
// in the frontmatter (brief §5).

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
