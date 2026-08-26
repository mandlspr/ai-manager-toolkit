import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { entryFrontmatterSchema } from "./content/schema.mjs";

// Une fiche = src/content/entries/{id}.{lang}.md  (brief, section 3).
//
// EN est la langue canonique du contenu : sa version garde l'id nu
// (`gov-double-test`), FR/DE sont suffixées (`gov-double-test.fr`). Les liens
// croisés (`liens`, `prouve`) pointent toujours l'id nu = version EN canonique.
const entries = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/entries",
    generateId: ({ data }) => {
      const id = String(data.id ?? "").trim();
      const lang = String(data.lang ?? "en").trim();
      // EN est la langue canonique : id nu. FR/DE sont suffixés (id.fr, id.de).
      return lang === "en" ? id : `${id}.${lang}`;
    },
  }),
  schema: entryFrontmatterSchema,
});

export const collections = { entries };
