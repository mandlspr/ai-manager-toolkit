// Reference diagrams — autonomous SVG files in src/assets/diagrams/.
// They carry their own fonts and colours; the site never restyles them.
// Loaded raw so the markup can be inlined (selectable text, faithful print).

const RAW = import.meta.glob<string>("/src/assets/diagrams/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

const bySlug = new Map<string, string>();
for (const [path, raw] of Object.entries(RAW)) {
  const slug = path.split("/").pop()!.replace(/\.svg$/, "");
  bySlug.set(slug, raw);
}

/** Raw SVG markup for a slug (file name without extension), or undefined. */
export function diagramMarkup(slug: string): string | undefined {
  return bySlug.get(slug);
}

/** Human title, read from the SVG's own <title>; falls back to the slug. */
export function diagramTitle(slug: string): string {
  const m = bySlug.get(slug)?.match(/<title>([\s\S]*?)<\/title>/);
  return m ? m[1].trim() : slug;
}

/** Gallery display order — all ten (there is no ifg-07). */
export const DIAGRAM_ORDER = [
  "ifg-01-what-to-optimise",
  "ifg-02-who-in-the-room",
  "ifg-03-how-much-control",
  "ifg-04-change-what",
  "ifg-05-can-you-send-this",
  "ifg-06-what-reaches-the-model",
  "ifg-08-where-does-it-land",
  "ifg-09-the-loop",
  "ifg-09b-three-one-zero",
  "ifg-10-what-expires",
] as const;
