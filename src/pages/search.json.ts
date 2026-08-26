import type { APIRoute } from "astro";
import { getPublishedEntries, cote } from "../lib/entries";

/** Réduit le Markdown à du texte brut cherchable (titre/résumé/corps — brief §5). */
function toText(md: string): string {
  return md
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Index de recherche généré au build. Aucun service externe : le client le
// télécharge une fois et filtre côté navigateur.
export const GET: APIRoute = async () => {
  const entries = await getPublishedEntries();
  const rows = entries.map((e) => ({
    id: e.data.id,
    cote: cote(e),
    titre: e.data.titre,
    resume: e.data.resume,
    bloc: e.data.bloc,
    type: e.data.type,
    statut: e.data.statut,
    transverses: e.data.transverses,
    prouve: e.data.prouve ?? [],
    liens: e.data.liens ?? [],
    url: `/${e.data.bloc}/${e.data.id}/`,
    texte: toText(e.body ?? ""),
  }));

  return new Response(JSON.stringify(rows), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
