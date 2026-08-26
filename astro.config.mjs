// @ts-check
import { defineConfig } from "astro/config";

// Étape 1 du brief : squelette + Content Collections + schéma Zod.
// La config GitHub Pages (`site`, `base`) et les intégrations éventuelles
// arrivent à l'étape 6. Rien d'autre n'est ajouté ici pour l'instant.
export default defineConfig({
  output: "static",
});
