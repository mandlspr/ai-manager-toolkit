import type { APIRoute } from "astro";
import { getPublishedEntries, cote } from "../lib/entries";

/** Reduces Markdown to plain searchable text (title/summary/body — brief §5). */
function toText(md: string): string {
  return md
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Search index generated at build time. No external service: the client
// downloads it once and filters in the browser.
export const GET: APIRoute = async () => {
  const entries = await getPublishedEntries();
  const rows = entries.map((e) => ({
    id: e.data.id,
    cote: cote(e),
    title: e.data.title,
    summary: e.data.summary,
    section: e.data.section,
    type: e.data.type,
    status: e.data.status,
    crosscutting: e.data.crosscutting,
    proves: e.data.proves ?? [],
    links: e.data.links ?? [],
    url: `/${e.data.section}/${e.data.id}/`,
    texte: toText(e.body ?? ""),
  }));

  return new Response(JSON.stringify(rows), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
