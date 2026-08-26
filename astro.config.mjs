// @ts-check
import { defineConfig } from "astro/config";

// GitHub Pages deployment (mandlspr.github.io/ai-manager-toolkit).
// Every internal link goes through `import.meta.env.BASE_URL` via the
// `cheminLocalise` helper (src/i18n/ui.ts) and the catalogue script.
export default defineConfig({
  site: "https://mandlspr.github.io",
  base: "/ai-manager-toolkit",
  output: "static",
});
