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
 * Prefixes an absolute path (`/governance/…`) with the site `base`
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

type BlocKey = "governance" | "prompts" | "build" | "evaluation" | "cases";

interface Textes {
  htmlLang: string;
  nav: { about: string; print: string; quiz: string };
  navBloc: Record<BlocKey, string>;
  quiz: {
    intro: string;
    sectionGeneral: string;
    selectN: string;
    check: string;
    next: string;
    restart: string;
    correct: string;
    incorrect: string;
    partial: string;
    score: string;
    end: string;
    seeCard: string;
    emptyPool: string;
  };
  bloc: Record<BlocKey, { label: string; description: string }>;
  breadcrumbHome: string;
  home: { intro: string; methodLink: string };
  cards: (n: number) => string;
  search: { label: string; placeholder: string };
  facet: { bloc: string; type: string; statut: string; axes: string };
  optType: Record<"principle" | "case", string>;
  optStatut: Record<"valid" | "to-resource" | "draft", string>;
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
      governance: "Governance",
      prompts: "Prompts",
      build: "Build",
      evaluation: "Evaluation",
      cases: "Cases",
    },
    fr: {
      governance: "Gouvernance",
      prompts: "Prompts",
      build: "Build",
      evaluation: "Évaluation",
      cases: "Cas",
    },
    de: {
      governance: "Governance",
      prompts: "Prompts",
      build: "Build",
      evaluation: "Evaluierung",
      cases: "Fälle",
    },
  },
};

export const T: Record<Langue, Textes> = {
  en: {
    htmlLang: "en",
    nav: { about: "Method", print: "Printable version", quiz: "Quiz" },
    navBloc: commonBloc.navBloc.en,
    quiz: {
      intro:
        "96 questions from the W1–W7 course, drawn from the same sources as the cards. Filter by section, answer one at a time. The score lives in memory only and resets when you change the filter or reload.",
      sectionGeneral: "General",
      selectN: "Select {n} answers",
      check: "Check",
      next: "Next",
      restart: "Restart",
      correct: "Correct",
      incorrect: "Incorrect",
      partial: "Partially correct — you selected {c} of {n} correct answers",
      score: "{a} answered · {c} correct",
      end: "End of the set — {c} / {n} correct",
      seeCard: "Read the matching card →",
      emptyPool: "No question matches this selection.",
    },
    bloc: {
      governance: {
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
      cases: {
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
    optType: { principle: "Principle", case: "Case" },
    optStatut: {
      valid: "valid",
      "to-resource": "to re-source",
      draft: "draft",
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
    nav: { about: "À propos", print: "Version imprimable", quiz: "Quiz" },
    navBloc: commonBloc.navBloc.fr,
    quiz: {
      intro:
        "96 questions du cursus W1–W7, tirées des mêmes sources que les fiches. Filtrez par bloc, répondez une à une. Le score n'existe qu'en mémoire et repart de zéro si vous changez le filtre ou rechargez la page.",
      sectionGeneral: "Général",
      selectN: "Sélectionnez {n} réponses",
      check: "Valider",
      next: "Suivante",
      restart: "Recommencer",
      correct: "Bonne réponse",
      incorrect: "Mauvaise réponse",
      partial: "Partiellement correct — vous avez coché {c} bonne(s) réponse(s) sur {n}",
      score: "{a} répondues · {c} correctes",
      end: "Fin de la série — {c} / {n} correctes",
      seeCard: "Lire la fiche correspondante →",
      emptyPool: "Aucune question ne correspond à cette sélection.",
    },
    bloc: {
      governance: {
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
      cases: {
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
    optType: { principle: "Principe", case: "Cas" },
    optStatut: {
      valid: "valide",
      "to-resource": "a-resourcer",
      draft: "brouillon",
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
    nav: { about: "Methode", print: "Druckversion", quiz: "Quiz" },
    navBloc: commonBloc.navBloc.de,
    quiz: {
      intro:
        "96 Fragen aus dem Kurs W1–W7, aus denselben Quellen wie die Karten. Nach Bereich filtern, eine nach der anderen beantworten. Der Punktestand liegt nur im Speicher und wird bei Filterwechsel oder Neuladen zurückgesetzt.",
      sectionGeneral: "Allgemein",
      selectN: "{n} Antworten auswählen",
      check: "Prüfen",
      next: "Weiter",
      restart: "Neu starten",
      correct: "Richtig",
      incorrect: "Falsch",
      partial: "Teilweise richtig — Sie haben {c} von {n} richtigen Antworten ausgewählt",
      score: "{a} beantwortet · {c} richtig",
      end: "Ende der Serie — {c} / {n} richtig",
      seeCard: "Zur passenden Karte →",
      emptyPool: "Keine Frage entspricht dieser Auswahl.",
    },
    bloc: {
      governance: {
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
      cases: {
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
    optType: { principle: "Prinzip", case: "Fall" },
    optStatut: {
      valid: "gültig",
      "to-resource": "nachzubelegen",
      draft: "Entwurf",
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
