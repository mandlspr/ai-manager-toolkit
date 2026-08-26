import { getCollection, type CollectionEntry } from "astro:content";

export type Entry = CollectionEntry<"entries">;

// Métadonnées des cinq blocs — brief §2. Le marqueur emoji n'est utilisé QUE
// comme repère de bloc (brief §6), jamais comme icône d'interface.
export const BLOCS = {
  gouvernance: {
    prefixe: "GOV",
    label: "Gouvernance & risque",
    marqueur: "⚖️",
    description: "Cadre légal, contrôles, données, sécurité.",
  },
  prompts: {
    prefixe: "PRM",
    label: "Prompts & conception",
    marqueur: "✳️",
    description: "Structures de prompt, méthodes de conception.",
  },
  build: {
    prefixe: "BLD",
    label: "Build, agents & orchestration",
    marqueur: "🔩",
    description: "Frameworks de construction, agents, workflows.",
  },
  evaluation: {
    prefixe: "EVL",
    label: "Évaluation, choix d'outils & coût",
    marqueur: "📐",
    description: "Comparaison, sélection, benchmarks, budget.",
  },
  cas: {
    prefixe: "CAS",
    label: "Cas pratiques & preuves",
    marqueur: "📎",
    description: "Projets réels, arbitrages datés.",
  },
} as const;

export type BlocId = keyof typeof BLOCS;

export const BLOC_ORDER = [
  "gouvernance",
  "prompts",
  "build",
  "evaluation",
  "cas",
] as const satisfies readonly BlocId[];

// Le schéma de contenu est déclaré en JS (schema.mjs) : Astro type donc `bloc`
// comme `string`. Ces deux accès recentrent le typage sans `any`.
export function blocMeta(bloc: string) {
  return BLOCS[bloc as BlocId];
}
export function blocRank(bloc: string): number {
  return (BLOC_ORDER as readonly string[]).indexOf(bloc);
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

export function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(d);
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
