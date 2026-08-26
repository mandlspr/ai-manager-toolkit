import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { entryFrontmatterSchema } from "./content/schema.mjs";

// One card = src/content/entries/{id}.{lang}.md  (brief, section 3).
//
// EN is the canonical content language: its version keeps the bare id
// (`gov-double-test`), FR/DE are suffixed (`gov-double-test.fr`). Cross-links
// (`liens`, `prouve`) always point to the bare id = canonical EN version.
const entries = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/entries",
    generateId: ({ data }) => {
      const id = String(data.id ?? "").trim();
      const lang = String(data.lang ?? "en").trim();
      // EN is the canonical language: bare id. FR/DE are suffixed (id.fr, id.de).
      return lang === "en" ? id : `${id}.${lang}`;
    },
  }),
  schema: entryFrontmatterSchema,
});

export const collections = { entries };
