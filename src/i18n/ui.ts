// Interface strings — hand-written in EN / FR / DE. No machine translation.
// EN is the canonical language (root `/`).

export const LANGUES = ["en", "fr", "de"] as const;
export type Langue = (typeof LANGUES)[number];

export const LANGUE_CANONIQUE: Langue = "en";

// Publication flag: only these languages are selectable in the public switcher.
// The others stay visible but greyed out; their routes exist and are reachable
// directly.
export const LANGUES_PUBLIEES: readonly Langue[] = ["en"];

export function estPubliee(l: Langue): boolean {
  return LANGUES_PUBLIEES.includes(l);
}

/**
 * Prefixes an absolute path (`/gouvernance/…`) with the site `base`
 * (`import.meta.env.BASE_URL`, = `/` locally without base, `/ai-manager-toolkit/`
 * in GitHub Pages production). Every internal link must go through here.
 */
export function withBase(chemin: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${chemin}`;
}

/** Internal path, localized AND base-prefixed. */
export function cheminLocalise(lang: Langue, chemin: string): string {
  return withBase(
    lang === LANGUE_CANONIQUE ? chemin : `/${lang}${chemin}`,
  );
}

export const NOM_LANGUE: Record<Langue, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
};

type BlocKey = "gouvernance" | "prompts" | "build" | "evaluation" | "cas";

interface Textes {
  htmlLang: string;
  nav: { about: string; print: string };
  navBloc: Record<BlocKey, string>;
  bloc: Record<BlocKey, { label: string; description: string }>;
  breadcrumbHome: string;
  home: { intro: string; methodLink: string };
  cards: (n: number) => string;
  search: { label: string; placeholder: string };
  facet: { bloc: string; type: string; statut: string; axes: string };
  optType: Record<"principe" | "cas", string>;
  optStatut: Record<"valide" | "a-resourcer" | "brouillon", string>;
  optAxe: Record<"cout" | "hitl" | "tracabilite", string>;
  reset: string;
  empty: string;
  listProvenBy: string;
  listProves: string;
  bandeau: {
    statut: string;
    type: string;
    axes: string;
    verifie: string;
    source: string;
    sources: string;
    liens: string;
  };
  reviewBadge: string;
  limitedScope: string;
  provenPrinciples: string;
  provingCases: string;
  seeAlso: string;
  backPrefix: string;
  casIntro: string;
  print: { title: string; note: (n: number) => string };
  footer: string;
  skip: string;
  langLabel: string;
  bascule: string;
}

const commonBloc = {
  navBloc: {
    en: {
      gouvernance: "Governance",
      prompts: "Prompts",
      build: "Build",
      evaluation: "Evaluation",
      cas: "Cases",
    },
    fr: {
      gouvernance: "Gouvernance",
      prompts: "Prompts",
      build: "Build",
      evaluation: "Évaluation",
      cas: "Cas",
    },
    de: {
      gouvernance: "Governance",
      prompts: "Prompts",
      build: "Build",
      evaluation: "Evaluierung",
      cas: "Fälle",
    },
  },
};

export const T: Record<Langue, Textes> = {
  en: {
    htmlLang: "en",
    nav: { about: "Method", print: "Printable version" },
    navBloc: commonBloc.navBloc.en,
    bloc: {
      gouvernance: {
        label: "Governance & risk",
        description: "Legal framework, controls, data, security.",
      },
      prompts: {
        label: "Prompts & design",
        description: "Prompt structures, design methods.",
      },
      build: {
        label: "Build, agents & orchestration",
        description: "Build frameworks, agents, workflows.",
      },
      evaluation: {
        label: "Evaluation, tool choice & cost",
        description: "Comparison, selection, benchmarks, budget.",
      },
      cas: {
        label: "Case studies & evidence",
        description: "Real projects, dated trade-offs.",
      },
    },
    breadcrumbHome: "Home",
    home: {
      intro:
        "A manual you consult, filter, and print. Durable, sourced principles and dated cases that prove them. Content is separate from code: one card = one Markdown file.",
      methodLink:
        "The method: durability test, statuses, publication rule →",
    },
    cards: (n) => `${n} card${n === 1 ? "" : "s"}`,
    search: {
      label: "Search",
      placeholder: "Title, summary, body…  ( / to focus )",
    },
    facet: {
      bloc: "Section",
      type: "Type",
      statut: "Status",
      axes: "Cross-cutting axes",
    },
    optType: { principe: "Principle", cas: "Case" },
    optStatut: {
      valide: "valid",
      "a-resourcer": "to re-source",
      brouillon: "draft",
    },
    optAxe: { cout: "cost", hitl: "HITL", tracabilite: "traceability" },
    reset: "Reset",
    empty: "No card matches these filters.",
    listProvenBy: "Proven by:",
    listProves: "Proves:",
    bandeau: {
      statut: "Status",
      type: "Type",
      axes: "Axes",
      verifie: "Verified on",
      source: "Source",
      sources: "Sources",
      liens: "Cross-links",
    },
    reviewBadge: "review",
    limitedScope: "Limited scope",
    provenPrinciples: "Principles proven:",
    provingCases: "Cases that prove it:",
    seeAlso: "See also:",
    backPrefix: "←",
    casIntro:
      "Dated evidence: context, action, result. Each case illustrates one or more principles and can never replace one.",
    print: {
      title: "Printable version",
      note: (n) =>
        `${n} published cards, one page, no pagination. Use your browser's print (Cmd/Ctrl + P) to make a PDF. Drafts are excluded; sources are shown in full.`,
    },
    footer:
      "Operational manual — content is separate from code, one card = one Markdown file.",
    skip: "Skip to content",
    langLabel: "Language",
    bascule:
      "This card is not available in English — canonical English version shown.",
  },

  fr: {
    htmlLang: "fr",
    nav: { about: "À propos", print: "Version imprimable" },
    navBloc: commonBloc.navBloc.fr,
    bloc: {
      gouvernance: {
        label: "Gouvernance & risque",
        description: "Cadre légal, contrôles, données, sécurité.",
      },
      prompts: {
        label: "Prompts & conception",
        description: "Structures de prompt, méthodes de conception.",
      },
      build: {
        label: "Build, agents & orchestration",
        description: "Frameworks de construction, agents, workflows.",
      },
      evaluation: {
        label: "Évaluation, choix d'outils & coût",
        description: "Comparaison, sélection, benchmarks, budget.",
      },
      cas: {
        label: "Cas pratiques & preuves",
        description: "Projets réels, arbitrages datés.",
      },
    },
    breadcrumbHome: "Accueil",
    home: {
      intro:
        "Un manuel qu'on consulte, qu'on filtre et qu'on imprime. Des principes durables et sourcés, des cas datés qui les prouvent. Le contenu est séparé du code : une fiche = un fichier Markdown.",
      methodLink:
        "La méthode : test de durabilité, statuts, règle de publication →",
    },
    cards: (n) => `${n} fiche${n === 1 ? "" : "s"}`,
    search: {
      label: "Recherche",
      placeholder: "Titre, résumé, corps…  ( / pour activer )",
    },
    facet: {
      bloc: "Bloc",
      type: "Type",
      statut: "Statut",
      axes: "Axes transversaux",
    },
    optType: { principe: "Principe", cas: "Cas" },
    optStatut: {
      valide: "valide",
      "a-resourcer": "a-resourcer",
      brouillon: "brouillon",
    },
    optAxe: { cout: "coût", hitl: "HITL", tracabilite: "traçabilité" },
    reset: "Réinitialiser",
    empty: "Aucune fiche ne correspond à ces critères.",
    listProvenBy: "Prouvé par :",
    listProves: "Prouve :",
    bandeau: {
      statut: "Statut",
      type: "Type",
      axes: "Axes",
      verifie: "Vérifié le",
      source: "Source",
      sources: "Sources",
      liens: "Liens croisés",
    },
    reviewBadge: "à revoir",
    limitedScope: "Périmètre limité",
    provenPrinciples: "Principes prouvés :",
    provingCases: "Cas qui le prouvent :",
    seeAlso: "Voir aussi :",
    backPrefix: "←",
    casIntro:
      "Une preuve datée : contexte, action, résultat. Chaque cas illustre un ou plusieurs principes et ne peut jamais en tenir lieu.",
    print: {
      title: "Version imprimable",
      note: (n) =>
        `${n} fiches publiées, une seule page, sans pagination. Utilisez l'impression du navigateur (Cmd/Ctrl + P) pour générer un PDF. Les brouillons sont exclus ; les sources sont en clair.`,
    },
    footer:
      "Manuel opérationnel — le contenu est séparé du code, une fiche = un fichier Markdown.",
    skip: "Aller au contenu",
    langLabel: "Langue",
    bascule:
      "Cette fiche n'est pas encore traduite en français — version anglaise affichée.",
  },

  de: {
    htmlLang: "de",
    nav: { about: "Methode", print: "Druckversion" },
    navBloc: commonBloc.navBloc.de,
    bloc: {
      gouvernance: {
        label: "Governance & Risiko",
        description: "Rechtsrahmen, Kontrollen, Daten, Sicherheit.",
      },
      prompts: {
        label: "Prompts & Konzeption",
        description: "Prompt-Strukturen, Konzeptionsmethoden.",
      },
      build: {
        label: "Build, Agenten & Orchestrierung",
        description: "Build-Frameworks, Agenten, Workflows.",
      },
      evaluation: {
        label: "Evaluierung, Tool-Wahl & Kosten",
        description: "Vergleich, Auswahl, Benchmarks, Budget.",
      },
      cas: {
        label: "Fallstudien & Nachweise",
        description: "Reale Projekte, datierte Abwägungen.",
      },
    },
    breadcrumbHome: "Startseite",
    home: {
      intro:
        "Ein Handbuch zum Nachschlagen, Filtern und Drucken. Beständige, belegte Prinzipien und datierte Fälle, die sie belegen. Inhalt getrennt vom Code: eine Karte = eine Markdown-Datei.",
      methodLink:
        "Die Methode: Beständigkeitstest, Status, Veröffentlichungsregel →",
    },
    cards: (n) => `${n} ${n === 1 ? "Karte" : "Karten"}`,
    search: {
      label: "Suche",
      placeholder: "Titel, Zusammenfassung, Text…  ( / zum Fokussieren )",
    },
    facet: {
      bloc: "Bereich",
      type: "Typ",
      statut: "Status",
      axes: "Querschnittsachsen",
    },
    optType: { principe: "Prinzip", cas: "Fall" },
    optStatut: {
      valide: "gültig",
      "a-resourcer": "nachzubelegen",
      brouillon: "Entwurf",
    },
    optAxe: {
      cout: "Kosten",
      hitl: "HITL",
      tracabilite: "Nachvollziehbarkeit",
    },
    reset: "Zurücksetzen",
    empty: "Keine Karte entspricht diesen Filtern.",
    listProvenBy: "Belegt durch:",
    listProves: "Belegt:",
    bandeau: {
      statut: "Status",
      type: "Typ",
      axes: "Achsen",
      verifie: "Geprüft am",
      source: "Quelle",
      sources: "Quellen",
      liens: "Querverweise",
    },
    reviewBadge: "prüfen",
    limitedScope: "Eingeschränkter Geltungsbereich",
    provenPrinciples: "Belegte Prinzipien:",
    provingCases: "Fälle, die es belegen:",
    seeAlso: "Siehe auch:",
    backPrefix: "←",
    casIntro:
      "Ein datierter Nachweis: Kontext, Handlung, Ergebnis. Jeder Fall veranschaulicht ein oder mehrere Prinzipien und kann sie nie ersetzen.",
    print: {
      title: "Druckversion",
      note: (n) =>
        `${n} veröffentlichte Karten, eine Seite, keine Paginierung. Nutzen Sie den Druckdialog des Browsers (Cmd/Strg + P) für ein PDF. Entwürfe sind ausgeschlossen; Quellen stehen im Klartext.`,
    },
    footer:
      "Betriebshandbuch — Inhalt getrennt vom Code, eine Karte = eine Markdown-Datei.",
    skip: "Zum Inhalt springen",
    langLabel: "Sprache",
    bascule:
      "Diese Karte ist noch nicht ins Deutsche übersetzt – die englische Fassung wird angezeigt.",
  },
};
