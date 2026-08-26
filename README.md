# AI Manager Toolkit

An operational manual for AI governance and practice: durable, sourced principles and
dated cases that prove them. Content is separate from code — one card = one Markdown
file, no database, no CMS.

**Live site:** https://mandlspr.github.io/ai-manager-toolkit

Stack: [Astro](https://astro.build) static output, Content Collections + a Zod schema,
client-side search and filters over a JSON index generated at build time. Deployed to
GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321/ai-manager-toolkit/
```

Node >= 18.20.8 / 20.3 / 22.

## Add or edit a card

**No code involved.** A card lives in a single Markdown file.

### Where

`src/content/entries/{id}.{lang}.md`

- `{id}`: stable kebab-case identifier, never renamed (cross-links depend on it).
- `{lang}`: `en` for the canonical version (required), `fr` / `de` for translations.

Easiest path: copy an existing card of the same `type` and adapt its frontmatter.
`gov-double-test.en.md` is a template for a `principle`, `cas-stackfit.en.md` for a `case`.

### The file

A YAML frontmatter block between `---`, then a body of `##` sections. Bodies are
placeholders for now (`<!-- to write -->`); keep the section headings.

- `type: principle` -> sections *Principle*, *Why it matters*, *How to apply it*,
  *Watch out* (the last one is optional).
- `type: case` -> sections *Context*, *What was done*, *Result*, **plus** a frontmatter
  field `proves: [id, ...]` listing the principles it illustrates.

### Frontmatter fields

The full list, allowed values, and validation rules live **in the schema**:
[`src/content/schema.mjs`](src/content/schema.mjs). Do not duplicate them here — the
schema is the source of truth. In short: `id`, `title`, `type`, `section`, `order`,
`status`, `crosscutting`, `lang`, `translations`, `sources` (>= 1), `verified`
(`date` required, plus `by` and `scope_limit`), `links`, `portfolio`, `summary`;
`proves` only for `case`. (`sources` item shape — `titre`, `emplacement`,
`date_document`, `nature`, `url` — is left as-is.)

### How `order` works

Positive integer, **unique within a `section`**, restarting at `1` for each section. It
orders the cards and derives the displayed shelf code: section prefix + `order` on two
digits — `governance` order 2 -> `GOV·02`. To insert a card between two others, renumber
the following cards in that section.

### What breaks the build if filled in wrong

`npm run check:content` (see below) refuses, among other things:

- `sources` empty, or a source with `nature: externe` and no `url`
- `verified.date` missing
- an `id` cited in `links` or `proves` that matches no card
- a `type: case` card without `proves`, or a `type: principle` card with a `proves`
- `proves` pointing to something other than a `principle`
- `order` missing, zero, or negative; two cards with the same `order` in one section
- two cards sharing the same `(id, lang)` pair

Display rules (these do not break the build): `status: draft` is visible in dev but
excluded from the production build; a `verified.date` older than 6 months automatically
shows a "review" badge.

## Publish an FR or DE translation later

1. Add `src/content/entries/{id}.fr.md` (or `.de.md`) next to the `.en.md`, with the
   **same `id`** and `lang: fr`. Until it exists, `/fr/...` serves the EN version with
   an amber "not yet translated" banner.
2. When a first batch is ready, add the language to `LANGUES_PUBLIEES` in
   [`src/i18n/ui.ts`](src/i18n/ui.ts):

   ```ts
   export const LANGUES_PUBLIEES: readonly Langue[] = ["en", "fr"];
   ```

   The language then becomes selectable in the switcher (instead of greyed out). The
   `/fr/*` routes already exist either way.

Interface strings (nav, labels, banner) are already translated EN/FR/DE in
`src/i18n/ui.ts` — only the card content remains to be supplied.

## `npm run build` and `npm run check:content`

| Command | Purpose |
|---|---|
| `npm run check:content` | Validates every `.md`: per-card Zod schema + cross-card integrity (cross-links, `order`/`id` uniqueness). Plain-language messages. |
| `npm run check:content:self-test` | Checks that each rule above actually fails validation (internal fixtures, no card touched). |
| `npm run build` | `check:content` -> `astro check` (types) -> `astro build`. The build fails if any of the three steps fails. |
| `npm run preview` | Serves `dist/` locally under `/ai-manager-toolkit/` (identical to production). |

**Reading a `check:content` failure:** the output lists each offending file followed by
its errors, indented — for example:

```
✖ Content validation — 2 error(s)

  src/content/entries/evl-new-card.en.md
    - sources — at least one source is required
    - proves -> "gov-missing" matches no card

Build interrupted.
```

Fix the frontmatter of the named file, run again. `astro check` separately reports type
errors in components (`.astro` / `.ts`), not in content.

## Deployment

Push to `main` -> GitHub Actions builds and publishes to GitHub Pages. Repo prerequisite:
**Settings -> Pages -> Source: GitHub Actions**.
