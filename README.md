# AI Manager Toolkit

Manuel opérationnel de gouvernance et de pratique de l'IA : des principes durables et
sourcés, des cas datés qui les prouvent. Le contenu est séparé du code — une fiche = un
fichier Markdown, aucune base de données, aucun CMS.

**Site en ligne :** https://mandlspr.github.io/ai-manager-toolkit

Stack : [Astro](https://astro.build) en génération statique, Content Collections + schéma
Zod, recherche/filtres côté client sur un index JSON généré au build. Déploiement
GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).

## Lancer en local

```sh
npm install
npm run dev      # http://localhost:4321/ai-manager-toolkit/
```

Node ≥ 18.20.8 / 20.3 / 22.

## Ajouter ou modifier une fiche

**Sans toucher au code.** Une fiche vit dans un seul fichier Markdown.

### Où

`src/content/entries/{id}.{lang}.md`

- `{id}` : identifiant stable en kebab-case, jamais renommé (les liens croisés en dépendent).
- `{lang}` : `en` pour la version canonique (obligatoire), `fr` / `de` pour les traductions.

Le plus simple : copier une fiche existante du même `type` et adapter le frontmatter.
`gov-double-test.en.md` sert de gabarit pour un `principe`, `cas-stackfit.en.md` pour un `cas`.

### Le fichier

Un bloc frontmatter YAML entre `---`, puis un corps en sections `##`. Les corps sont pour
l'instant des placeholders (`<!-- à rédiger -->`) ; on garde les titres de sections.

- `type: principe` → sections *Principe*, *Pourquoi ça compte*, *Comment l'appliquer*, *Point de vigilance* (la dernière est facultative).
- `type: cas` → sections *Contexte*, *Ce qui a été fait*, *Résultat*, **plus** un champ frontmatter `prouve: [id, …]` listant les principes illustrés.

### Champs du frontmatter

La liste complète, les valeurs autorisées et les règles de validation sont **dans le
schéma** : [`src/content/schema.mjs`](src/content/schema.mjs). Ne pas le dupliquer ici —
c'est lui qui fait autorité. En résumé : `id`, `titre`, `type`, `bloc`, `ordre`, `statut`,
`transverses`, `lang`, `traductions`, `sources` (≥ 1), `verification` (`date` obligatoire),
`liens`, `portfolio`, `resume` ; `prouve` uniquement pour les `cas`.

### Comment `ordre` fonctionne

Entier positif, **unique à l'intérieur d'un même `bloc`**, repartant de `1` à chaque bloc.
Il sert à ranger les fiches et à dériver la cote affichée : préfixe du bloc + `ordre` sur
deux chiffres — `gouvernance` ordre 2 → `GOV·02`. Pour insérer une fiche entre deux
autres, renuméroter les suivantes du bloc.

### Ce qui casse le build si mal rempli

`npm run check:content` (voir plus bas) refuse de laisser passer, entre autres :

- `sources` vide, ou une source `nature: externe` sans `url`
- `verification.date` absent
- un `id` cité dans `liens` ou `prouve` qui ne correspond à aucune fiche
- une fiche `type: cas` sans `prouve`, ou une fiche `type: principe` avec un `prouve`
- `prouve` qui pointe vers autre chose qu'un `principe`
- `ordre` absent, nul ou négatif ; deux fiches avec le même `ordre` dans un bloc
- deux fiches avec le même couple `(id, lang)`

Règles d'affichage (ne cassent pas le build) : `statut: brouillon` est visible en dev mais
exclu du build de production ; une `verification.date` de plus de 6 mois affiche
automatiquement un badge « à revoir ».

## Publier une traduction FR ou DE

1. Déposer `src/content/entries/{id}.fr.md` (ou `.de.md`) à côté du `.en.md`, avec le
   **même `id`** et `lang: fr`. Tant qu'elle n'existe pas, `/fr/…` sert la version EN
   avec un bandeau ambre « pas encore traduite ».
2. Quand un premier lot est prêt, ajouter la langue à `LANGUES_PUBLIEES` dans
   [`src/i18n/ui.ts`](src/i18n/ui.ts) :

   ```ts
   export const LANGUES_PUBLIEES: readonly Langue[] = ["en", "fr"];
   ```

   La langue devient alors activable dans le sélecteur (au lieu d'être grisée). Les
   routes `/fr/*` existent déjà dans les deux cas.

Les chaînes d'interface (nav, libellés, bandeau) sont déjà traduites EN/FR/DE dans
`src/i18n/ui.ts` — seul le contenu des fiches reste à fournir.

## `npm run build` et `npm run check:content`

| Commande | Rôle |
|---|---|
| `npm run check:content` | Valide tous les `.md` : schéma Zod par fiche + intégrité inter-fiches (liens croisés, unicité `ordre`/`id`). Messages en clair, en français. |
| `npm run check:content:self-test` | Vérifie que chaque règle ci-dessus casse bien la validation (fixtures internes, aucune fiche modifiée). |
| `npm run build` | `check:content` → `astro check` (types) → `astro build`. Le build échoue si l'une des trois étapes échoue. |
| `npm run preview` | Sert `dist/` localement sous `/ai-manager-toolkit/` (rendu identique à la prod). |

**Lire un échec de `check:content` :** la sortie liste chaque fichier fautif suivi de ses
erreurs indentées, par exemple :

```
✖ Validation du contenu — 2 erreur(s)

  src/content/entries/evl-nouvelle-fiche.en.md
    - sources — au moins une source est obligatoire
    - prouve → « gov-inexistant » ne correspond à aucune fiche

Le build est interrompu.
```

Corriger le frontmatter du fichier nommé, relancer. `astro check` signale de son côté les
erreurs de types dans les composants (`.astro` / `.ts`), pas dans le contenu.

## Déploiement

Push sur `main` → GitHub Actions build et publie sur GitHub Pages. Prérequis côté dépôt :
**Settings → Pages → Source : GitHub Actions**.
