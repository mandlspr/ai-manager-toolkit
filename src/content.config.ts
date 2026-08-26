import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { entryFrontmatterSchema } from "./content/schema.mjs";

// Une fiche = src/content/entries/{id}.{lang}.md  (brief, section 3).
//
// L'`id` d'entrée de collection Astro = `{id}.{lang}` pour la version FR
// canonique on garde l'id nu, les autres langues sont suffixées. Les liens
// croisés du brief (`liens`, `prouve`) pointent l'id nu = version FR canonique.
const entries = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/entries",
    generateId: ({ data }) => {
      const id = String(data.id ?? "").trim();
      const lang = String(data.lang ?? "fr").trim();
      return lang === "fr" ? id : `${id}.${lang}`;
    },
  }),
  schema: entryFrontmatterSchema,
});

export const collections = { entries };
