// @ts-check
import { defineConfig } from "astro/config";

// Étape 6 — déploiement GitHub Pages (mandlspr.github.io/ai-manager-toolkit).
// Tous les liens internes passent par `import.meta.env.BASE_URL` via l'helper
// `cheminLocalise` (src/i18n/ui.ts) et le script du catalogue.
export default defineConfig({
  site: "https://mandlspr.github.io",
  base: "/ai-manager-toolkit",
  output: "static",
});
