# AI Manager Toolkit — Audit de valeur W1–W7

**Date :** 29.08.2026
**Baseline :** 27 fiches vivantes dans `~/code/GitHub/ai-manager-toolkit/src/content/entries/*.en.md` — arbre git propre, corps rédigés le 27.08, **non modifiées par cet audit**.
**Réservoir :** 7 extractions NotebookLM (W1–W7) + `StackFit_V1_Handshake_Project_Log.md`, `README_Handshake_19AOUT2026_FINAL.md`, `claude/Toolkit_Matiere_Premiere.md`.
**Règle appliquée :** valeur incrémentale, pas volume. Résultat visé : 27 fiches + le meilleur de W1–W7, pas 27 fiches + tout W1–W7.

> **Analogie de cadrage.** Le Toolkit est une bibliothèque déjà cataloguée. W1–W7 est un carton de livres arrivé d'un déménagement. Le travail n'est pas de vider le carton sur les étagères — c'est de repérer les trois ou quatre ouvrages qui manquaient vraiment au rayon, les cinq qui existent déjà en double, et ceux qui appartiennent à une autre bibliothèque.

---

## 1. Couverture actuelle

| Section | Fiches | Ce qu'elle couvre solidement | Ce qu'elle ne couvre pas |
|---|---|---|---|
| `governance` | 11 | Régime contractuel, hallucination, équité par segment, cycle produit, datasheet, jamais-vert, boucle CX | **Aucune fiche sur l'EU AI Act.** Aucune sur les responsabilités (qui décide). Aucune sur les attaques par prompt. |
| `prompts` | 3 | Structure (3C), placement (Lost in the Middle), diagnostic (3 questions) | Single-shot vs conversationnel. Équité en entrée. Zero/few-shot, chain-of-thought, chaining. |
| `build` | 6 | Gate 0, config d'agent, orchestration, debug par export, Discover→Do→Escalate, 8 garde-fous | Spectre d'autonomie. Distinction workflow / agent. |
| `evaluation` | 4 | Benchmarks, Jagged Frontier, profil utilisateur, make-or-buy | Séquencement Prompt → RAG → Fine-tuning. |
| `cases` | 3 | StackFit, Handshake, Suno — ses projets à elle | Aucune preuve externe citée dans les fiches principe. |

**Volume du réservoir :** 243 questions de quiz, 36 prompts, 97 nœuds de connaissance, 44 études de cas, 34 outils, 17 candidats infographies sur les sept semaines.

**Retenu après filtrage :** 96 questions (40 %), 5 prompts (14 %), 6 études de cas (14 %), 8 infographies (47 %), 8 fiches proposées.

---

## 2. Forces du Toolkit tel qu'il est

1. **La gouvernance est la section la plus mûre** — 11 fiches, et surtout des fiches *opérationnelles* (jamais-vert, équité par segment, régime contractuel) plutôt que des redites de principes éthiques. C'est rare.
2. **Les fiches cas sont ses projets à elle.** Aucune des 44 études de cas externes de W1–W7 ne vaut ce signal. C'est ce qui distingue ce Toolkit d'un résumé de cours.
3. **Le test de durabilité est déjà appliqué.** Aucune fiche ne repose sur un nom de modèle. W1–W7 en est truffé (Fable 5, Opus 4.8, GPT-5.5, Mistral Large 3) — le Toolkit a bien filtré.
4. **Les désaccords entre sources sont énoncés, pas moyennés** — `cas-stackfit`, `cas-handshake`, `prm-3c`. C'est la règle `evl-benchmarks` appliquée au Toolkit lui-même.

---

## 3. Manques majeurs

Classés par sévérité du trou de connaissance × transférabilité.

### 3.1 L'EU AI Act n'existe pas dans le Toolkit

**Le plus gros écart de tout l'audit.** La section governance compte 11 fiches. La totalité du quiz W7 — 13 questions — porte sur l'EU AI Act : pratiques interdites (Art. 5), classification haut risque (Art. 6 / Annexe III), transparence (Art. 50), conservation des journaux ≥ 6 mois. Le Playbook contient déjà la table des articles. **C'est un trou de Toolkit, pas un trou de source.**

Et l'élément le plus exploitable commercialement n'est même pas la pyramide : c'est l'**Art. 4**, l'obligation de compétence IA en vigueur depuis le 02.02.2025. C'est une obligation de moyens (*Bemühenspflicht*), sans certificat requis, qui **s'applique quel que soit le niveau de risque**. Autrement dit : former les équipes n'est pas une bonne pratique, c'est une obligation légale. C'est l'argument de vente direct du rôle AI Enablement, et il n'est écrit nulle part dans le Toolkit.

### 3.2 Personne ne décide

`gov-cycle-de-vie` couvre le cycle produit. `gov-boucle-cx` couvre la boucle de signal client. **Aucune fiche ne dit qui décide quoi.** W7 fournit le cycle de gouvernance en 6 étapes (Erfassen → Einordnen → Prüfen → Entscheiden → Befähigen → Überwachen) et la matrice RACI avec la règle « un seul A par tâche ». Le Playbook ajoute le tableau *Wer muss an den Tisch?* et le point d'échec le plus sous-estimé du marché allemand : le **Betriebsrat arrive « früh », pas « bei Bedarf »** (§87 BetrVG). C'est la cause d'échec la plus citée en cours pour un chatbot interne — avant même la protection des données.

### 3.3 Rien sur le séquencement Prompt → RAG → Fine-tuning

Le seul framework du corpus corroboré par **trois semaines indépendantes** (W2, W5, W7). Et il porte l'erreur la plus coûteuse que fait un comité de direction : *« on va fine-tuner le modèle pour qu'il connaisse notre catalogue »*. Les trois sources disent la même chose — RAG = mémoire courte, ajoute des faits ; fine-tuning = mémoire longue, ajoute du style et du format, **n'ajoute aucun fait**.

### 3.4 Single-shot vs conversationnel

C'est la distinction qui décide si un prompt peut entrer dans un workflow automatisé. Testée trois fois en W2, signalée comme « distinction critique » dans `Toolkit_Matiere_Premiere`, et absente des trois fiches prompts. Un prompt conversationnel qui plante se rattrape au tour suivant ; un single-shot qui plante fait tomber toute la chaîne sans que personne ne le voie. **C'est aussi le pont manquant entre la section `prompts` et la section `build`.**

### 3.5 Trois autres, à priorité 2

| Manque | Source | Pourquoi ça compte |
|---|---|---|
| Injection / leaking / jailbreaking | W2 | `bld-garde-fous-agents` encadre ce que l'agent *fait*, pas ce qu'on lui *dit*. Preuve disponible : GTG-1002. |
| Équité en **entrée** de prompt (biais de traduction) | W7 | `gov-equite-segment` mesure la sortie. Rien ne couvre la conception. Le point sur la langue est non-évident : la logique interne des modèles est anglophone. |
| Écart confiance / capacité (*AI Trust Gap*) | W3, W6 | Son angle de positionnement le plus différenciant — et le Toolkit n'a **aucune section adoption / enablement** pour l'accueillir. |

---

## 4. Questions résolues par W1–W7

Le rapport du 27.08 avait laissé six points ouverts. **Quatre sont résolus.**

| Question du 27.08 | Verdict | Preuve |
|---|---|---|
| `prm-3c` — Character/Context/Command ou Contexte/Commande/Contrainte ? | ✅ **RÉSOLU** | Le matériel de cours (W2T1 slides + *Was haben wir gelernt* + quiz Q-2112) définit **Character, Context, Command**. La variante FR du glossaire Notion est une note de traduction, pas la définition du cours. |
| `evl-jagged-frontier` — concept introuvable dans la page Notion W2 | ✅ **RÉSOLU** | Présent dans l'extraction W2, avec ancrage chiffré : médaille d'or à l'olympiade de mathématiques mais **< 51 % de justesse sur ClockBench**. Source nommée : AI Index 2026. Le champ `sources: Notebook W2` est correct. |
| `evl-profil-utilisateur` — les 4 profils sont-ils W4 ? | ✅ **RÉSOLU** | Oui. `W4T1_Support_Cours_Presentation` (passage 104) : non-technique → Lovable/Bolt ; technique qui aime coder → Windsurf/Cursor ; technique sans coder → Replit/Tempo/Bolt ; non-technique orienté produit → Tempo. |
| `gov-hebergement-public` — Impressum/Datenschutz sont-ils W4 ? | ✅ **RÉSOLU** | Oui, sous forme de note de gouvernance attachée au prompt de page portfolio W4T1 : ne pas publier via un hébergement statique tant que mentions légales et politique de confidentialité ne sont pas intégrées. |
| `bld-config-agent` — quels sont les ingrédients constants ? | ❌ **AGGRAVÉ** | Voir §5.1. |
| `cas-suno` — l'outil a-t-il été exclu ? | ❌ **CONFIRMÉ NON** | Voir §5.2. |

---

## 5. Questions encore ouvertes

### 5.1 `bld-config-agent` — trois découpages incompatibles

Le rapport du 27.08 signalait un conflit à deux voix. W1–W7 en révèle **quatre** :

| Source | Découpage |
|---|---|
| Notion W5, légende du schéma | System-Prompt + règles + skills + tools **(4)** |
| W5 quiz Q-5411 + W7 | System Prompt + Toolbox + Agenda **(3)** |
| W5 quiz Q-5311 | LLM + outils/API externes + orchestration **(3)** |
| W4 (agent de code) | LLM, embeddings, retriever, tools, UI, orchestrateur, MCP, rules **(8)** |

W5 tranche explicitement, et sa consigne est de **ne pas trancher** : *« Keep both definitions distinct; do not merge or normalize. »*

→ Le titre actuel de la fiche, *« four constant ingredients »*, présuppose une réponse que les sources ne donnent pas. C'est le seul endroit du Toolkit où un titre de fiche est en avance sur ses sources.

### 5.2 `cas-suno` — aucune exclusion n'est consignée nulle part

W3 confirme et amplifie ce que signalait le rapport du 27.08. L'outil est **utilisé** (exercice de groupe + signature sonore KherzMusic), 4 versions de prompt itérées, export croppé à 31 s, intégré au livrable vidéo, et l'exercice est explicitement marqué *« pourquoi je le garde »*. Le titre (*Excluding a consumer-grade creative tool from professional use*) et le `summary` restent non soutenus.

En revanche, le **fond juridique de la fiche se renforce** : GEMA vs OpenAI (LG München I, 11.11.2025) est le premier jugement de principe européen sur l'IA générative.

### 5.3 Handshake implémente 6 dimensions HLEG, W7 en annonce 7

Le README Handshake liste six dimensions : Human-Oversight, Robustness, Privacy, Transparency, Fairness, Accountability. Le quiz W7 énonce **sept** principes des lignes directrices EU pour une IA digne de confiance.

**Le corpus W1–W7 ne les énumère jamais toutes les sept au même endroit.** Le principe omis n'est donc pas déterminable depuis ces sources — et je ne le complète pas de mémoire. À vérifier à la source EU HLEG avant toute soutenance : soit c'est un choix de périmètre à assumer explicitement, soit c'est un oubli.

### 5.4 Points non tranchables depuis W1–W7 (sources projet uniquement)

- **Verdict StackFit sur Handshake.** Project Log : « Fit », 3 correctifs en attente. README 19.08 : « Fit with conditions » le 17.08, après 4 correctifs.
- **Nombre de comptes de test Handshake.** README 19.08 : 9–11. Playbook : 12. Frontmatter `verified.scope_limit` : 12.
- **Dates d'application EU AI Act.** W7 se contredit lui-même (02.12.2027 / 02.08.2028 selon les slides Digital-Omnibus de juillet 2026, vs 02.08.2027 dans des sources plus anciennes du même notebook), **et** une slide précise que le Digital Omnibus n'est pas définitivement adopté.
- **`bld-gate-zero` — les trois risques.** W5 se contredit : *sur-automatisation / objectifs flous / manque de documentation* d'un côté, *objectifs flous / manque de transparence / complexité excessive* de l'autre. La fiche porte la première version, qui est celle du texte source ; la seconde vient d'un quiz.

---

## 6. Enrichissements HIGH-value

Classés par priorité. Détail complet dans `toolkit_enrichment.json`.

### Priorité 1 — à faire

| # | Action | Type | Source |
|---|---|---|---|
| 1 | Créer `gov-ai-act-risques` (classification + Art. 4) | Nouvelle fiche | W6, W7, Playbook |
| 2 | Créer `evl-prompt-rag-finetune` (séquencement) | Nouvelle fiche | W2 + W5 + W7 |
| 3 | Créer `gov-raci-decision` (qui décide + Betriebsrat) | Nouvelle fiche | W7, Playbook |
| 4 | Créer `prm-single-shot` | Nouvelle fiche | W2 |
| 5 | `prm-3c` : remplacer le paragraphe de désaccord par la définition canonique | Renfort | W2 |
| 6 | `evl-jagged-frontier` : ajouter l'ancrage ClockBench < 51 % + AI Index 2026 | Renfort | W2 |
| 7 | `gov-regime-contractuel` : ajouter « un AVV ne suffit pas — serveurs, entité contractante, opt-out explicite » | Renfort | W1, W3 |
| 8 | `gov-ip-brand-fit` : ajouter GEMA vs OpenAI | Renfort | W7 |
| 9 | `bld-config-agent` : reformuler le titre, qui présuppose « quatre » | Correction | W4, W5, W7 |

### Priorité 2 — si l'architecture le porte

Créer `gov-prompt-attaques`, `prm-equite-prompt`, `enb-trust-gap`. Renforcer `bld-garde-fous-agents` (surface d'attaque du registre d'outils, contrôle d'accès à la couche donnée), `bld-discover-do-escalate` (filtre backend avant appel externe + SmartParts comme architecture de référence), `gov-cycle-de-vie` (déploiement par paliers), `bld-orchestration` (remplacer l'arbitrage parallèle/séquentiel non sourcé par l'arbitrage de facturation, qui l'est).

### Priorité 3 — optionnel

`bld-spectre-autonomie` (ou repli dans `bld-discover-do-escalate`), `evl-make-or-buy` (préciser « 48 h de vie »).

---

## 7. Fiches proposées — récapitulatif

| id | Section | Ce que ça résout | Quiz à l'appui | Priorité |
|---|---|---|---|---|
| `gov-ai-act-risques` | governance | Instrument de triage légal + obligation de compétence transversale | **11** | 1 |
| `evl-prompt-rag-finetune` | evaluation | Quoi optimiser, dans quel ordre — et pourquoi le fine-tuning n'ajoute pas de faits | 5 | 1 |
| `gov-raci-decision` | governance | Qui décide, et quand le Betriebsrat entre | — | 1 |
| `prm-single-shot` | prompts | Ce prompt est-il automatisable ? | 3 | 1 |
| `gov-prompt-attaques` | governance | Injection / leaking / jailbreak | 2 | 2 |
| `prm-equite-prompt` | prompts | Le biais entre aussi par le prompt | 1 | 2 |
| `enb-trust-gap` | **enablement (nouvelle)** | Pourquoi la qualité baisse juste après le déploiement | 3 | 2 |
| `bld-spectre-autonomie` | build | L'autonomie fixe le niveau de contrôle | 1 | 3 |

**Effet sur l'architecture :** governance 11 → 14, prompts 3 → 5, build 6 → 7, evaluation 4 → 5, cases 3 (inchangé), + une section `enablement` à une fiche.

> **Observation d'architecture.** La correction la plus justifiée par le matériau n'est pas l'ajout de fiches de gouvernance — c'est le passage de `prompts` de 3 à 5. W2 est la semaine la plus dense du cursus (47 questions), et c'est la section la moins construite du Toolkit. À l'inverse, `enablement` ouvrirait une section à une seule fiche : à ne faire que si elle assume cet axe comme positionnement, pas pour ranger un orphelin.

---

## 8. Contenu à ne PAS ajouter

| Contenu | Semaines | Raison |
|---|---|---|
| Fondamentaux ML, histoire de l'IA | W1, W2 | Hors critères (business-oriented, non-ingénieur). Déjà écarté dans `Toolkit_Matiere_Premiere`. |
| Plomberie web : API, CRUD, JWT, REST, scaling | W4 | 27 questions de quiz, aucun levier de décision. |
| Craft média : SKAOS, Kinolook, formule Firefly, prompting TTS | W3 | SKAOS duplique `prm-3c` en costume image. Relèverait d'une annexe créative séparée. |
| Horizon techno : quantique, robots, Omniverse, MoE, LNN, neurosymbolique | W6 | Culture générale. Exclusion déjà actée. |
| Gartner Hype Cycle | W6 | Conseil générique — sur la liste d'évitement du projet. |
| Catalogues d'outils (Zapier/Make/n8n, LangChain/CrewAI/AutoGen/Swarm) | W3, W5 | Listes sans cadre de décision. **Exception retenue :** la mécanique de facturation n8n (par exécution) vs Make (par étape), qui est un critère. |
| Noms, versions et prix de modèles | toutes | Échouent au test de durabilité du projet. |
| Cas d'entreprises externes en fiches `type: case` | toutes | Diluerait le signal portfolio. À citer comme preuve **dans** une fiche principe. |
| Prompts spécifiques à une tâche (MedGuide, portfolio, prospection B2B, vidéos KherzMusic) | W1, W3, W4 | Non réutilisables entre entreprises. |

---

## 9. Affirmations à vérifier avant publication

| Affirmation | Où | Pourquoi | Action |
|---|---|---|---|
| Dates d'application EU AI Act / statut du Digital Omnibus | `gov-ai-act-risques` | W7 se contredit et signale que l'Omnibus n'est pas adopté | Vérifier sur EUR-Lex. **Ne citer aucune date ferme.** |
| Le 7ᵉ principe EU HLEG | `cas-handshake`, `gov-responsible-ai` | W7 dit sept, Handshake en implémente six | Vérifier à la source EU. Ne rien compléter de mémoire. |
| Politique d'entraînement par fournisseur | `gov-regime-contractuel` | `verified.scope_limit` déjà marqué « volatile » | Revérifier à chaque publication |
| Gains CX 14–26 % | `enb-trust-gap` | W6 signale le conflit avec des mesures de +200 % sur le code | Citer le conflit, pas un chiffre unique |
| Comptes de test Handshake (9–11 vs 12) | `cas-handshake` | Sources projet divergentes | Trancher à la source Notion *Governance Signals* |
| Verdict StackFit (Fit / 3 vs Fit with conditions / 4) | `cas-stackfit` | Project Log vs README 19.08 | Trancher à la source, ou assumer le désaccord |
| Composants constants d'un agent | `bld-config-agent` | 4 découpages, W5 interdit la normalisation | Reformuler le titre |
| RAG rentable à partir de 50 documents | non utilisé | W5 qualifie lui-même le seuil d'« arbitraire » | Ne pas citer |
| Coût d'entraînement DeepSeek R1 (~5,6 M USD) | non utilisé | W1 enregistre la contestation de Hassabis | Ne citer qu'avec la contestation |
| 768 → 1536 dimensions : ×2 de calcul pour 3–5 % | non utilisé | Dans `Toolkit_Matiere_Premiere`, non corroboré en W5 | Ne pas citer |
| Cursor « +55 % de vélocité », Groq « 18× », Dell « 85 % des emplois de 2030 » | non utilisé | Chiffres marketing ou statistiques contestées | Exclure |

---

## 10. Diagnostic de couverture par le quiz

96 questions retenues sur 243, chacune rattachée à une fiche existante, à une fiche proposée, ou marquée `(unmapped)`.

**Ce que le quiz révèle :**

- **13 fiches sur 27 n'ont aucune couverture quiz.** Trois sont normales (les fiches cas — ce sont ses projets, absents du cursus). Dix ne le sont pas : `gov-double-test`, `gov-jamais-vert`, `gov-boucle-cx`, `gov-equite-segment`, `gov-hebergement-public`, `bld-orchestration`, `bld-debug-export`, `bld-garde-fous-agents`, `evl-jagged-frontier`, `evl-make-or-buy`.
  → Lecture : **ces fiches viennent du Playbook et de ses projets, pas du cursus.** C'est une force (contenu propriétaire) autant qu'un signal (elle sera moins « couverte » sur ces sujets par le matériel d'examen).
- **`gov-ai-act-risques`, qui n'existe pas, est adossée à 11 questions.** Le déséquilibre le plus net de l'audit.
- **23 questions restent `(unmapped)`** : zero/few-shot, chain-of-thought, prompt chaining, reverse prompt engineering, deepfakes, workflow vs agent, multi-agents, tendance durable vs hype. Ce sont les candidats de second rang si elle veut étendre au-delà des 8 fiches proposées.

**Provenance :** les 96 questions sont **toutes** `original` (verbatim des extractions). Zéro `source_derived`, zéro `newly_derived` — aucune question n'a été fabriquée pour gonfler le volume.

---

## 11. Livrables

| Fichier | Contenu |
|---|---|
| `TOOLKIT_GAP_ANALYSIS.md` | Ce document |
| `toolkit_enrichment.json` | 37 items audités et classés, 8 fiches proposées, 11 renforts, exclusions, vérifications |
| `quiz_global.json` | 96 questions avec provenance et rattachement + diagnostic de couverture + bloc d'exclusions |
| `prompt_enrichment.json` | 5 prompts retenus sur 36 examinés, avec les rejets motivés |
| `infographics_gallery.json` | 8 spécifications evergreen + 6 assets déjà générés à ne pas refaire + 9 rejets |
| `case_studies_evidence.json` | 6 preuves retenues sur 44, rattachées aux fiches |
| `knowledge_map.json` | 35 nœuds, 284 relations (CARD ↔ CONCEPT ↔ QUIZ ↔ PROMPT ↔ TOOL ↔ CASE ↔ GOVERNANCE ↔ INFOGRAPHIC) |

---

## 12. Sources

**Extractions NotebookLM (réservoir) :**
1. `aimanagertoolkitraw.json` — W1, 37 sources
2. `w2notebookaimanagertoolkitextraction.json` — W2, 31 sources
3. `aimanagertoolkitw3.json` — W3, 51 sources
4. `AI Manager Toolkit_ Week 4.md` — W4, 41 sources
5. `ai_manager_toolkit_w5.json` — W5, 32 sources
6. `w6aimanagertoolkitextraction.json` — W6, 31 sources
7. `ai_manager_toolkit_extraction_w7.json` — W7, 28 sources

**Documents du projet Claude :**
8. `StackFit_V1_Handshake_Project_Log.md` — 16.08.2026
9. `README_Handshake_19AOUT2026_FINAL.md` — source de vérité au 19.08.2026
10. `claude/Toolkit_Matiere_Premiere.md` — inspection complète W1–W7, 25.08.2026
11. `claude/Rapport_Redaction_27_Fiches_27AOUT2026.md` — rapport de rédaction, 27.08.2026

**Notion :**
12. *AI Governance & CX Enablement Playbook* — dernière réorganisation 13.08.2026, ajouts 14.08.2026

**Dépôt :**
13. `~/code/GitHub/ai-manager-toolkit/src/content/entries/*.en.md` — 27 fiches, HEAD au 29.08.2026

**Sources externes citées à l'intérieur des extractions** (non vérifiées de première main dans cet audit) : Stanford HAI *AI Index 2026*, Docker *State of Agentic AI* (805 praticiens), Anthropic *Threat Intelligence Report GTG-1002*, LG München I *GEMA vs OpenAI* (11.11.2025), Forrester Predictions 2026, Deloitte *State of AI*, KPMG *Generative KI in der deutschen Wirtschaft 2026*, EU AI Act et lignes directrices EU HLEG 2019.

---

*Le Toolkit vivant n'a pas été modifié. Aucun Toolkit parallèle n'a été créé.*
