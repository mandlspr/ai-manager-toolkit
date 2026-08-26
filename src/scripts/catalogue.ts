// Recherche plein texte + filtres cumulables, côté client, sur l'index
// /search.json généré au build. État des filtres porté par l'URL (query params)
// pour que la vue soit partageable — brief §5. Aucun localStorage.

interface Row {
  id: string;
  cote: string;
  titre: string;
  resume: string;
  bloc: string;
  type: string;
  statut: string;
  transverses: string[];
  prouve: string[];
  liens: string[];
  url: string;
  texte: string;
}

interface Filtres {
  q: string;
  bloc: string;
  type: string;
  statut: string;
  axes: string[];
}

const BLOC_ORDER = ["gouvernance", "prompts", "build", "evaluation", "cas"];

function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string,
  );
}

export async function initCatalogue(): Promise<void> {
  const root = document.querySelector<HTMLElement>("[data-catalogue]");
  if (!root) return;

  const form = root.querySelector<HTMLFormElement>("[data-filtres]");
  const liste = root.querySelector<HTMLElement>("[data-liste]");
  const compte = root.querySelector<HTMLElement>("[data-compte]");
  if (!form || !liste || !compte) return;

  const seedBloc = root.dataset.seedBloc ?? "";
  const lang = root.dataset.lang ?? "en";
  const prefixe = lang && lang !== "en" ? `/${lang}` : "";
  const url = (u: string): string => prefixe + u;

  // chaînes localisées passées par le composant Astro
  const tEmpty = root.dataset.tEmpty ?? "No card matches these filters.";
  const tProvenBy = root.dataset.tProvenby ?? "Proven by:";
  const tProves = root.dataset.tProves ?? "Proves:";
  const tCardOne = root.dataset.tCardOne ?? "card";
  const tCardMany = root.dataset.tCardMany ?? "cards";
  const compteTexte = (n: number): string =>
    `${n} ${n === 1 ? tCardOne : tCardMany}`;

  interface OptLabels {
    type: Record<string, string>;
    statut: Record<string, string>;
    axe: Record<string, string>;
    review: string;
  }
  let opt: OptLabels = { type: {}, statut: {}, axe: {}, review: "review" };
  try {
    opt = { ...opt, ...(JSON.parse(root.dataset.tOpt ?? "{}") as OptLabels) };
  } catch {
    /* garde les valeurs brutes */
  }
  const lbl = (map: Record<string, string>, k: string): string => map[k] ?? k;

  let rows: Row[] = [];
  try {
    const res = await fetch("/search.json");
    rows = (await res.json()) as Row[];
  } catch {
    return; // on garde la liste rendue au build
  }
  const byId = new Map(rows.map((r) => [r.id, r]));

  const q = form.querySelector<HTMLInputElement>("[name=q]");
  if (!q) return;

  // Pastilles de filtre (remplacent les <select>/<checkbox> natifs).
  const pastilles = Array.from(
    form.querySelectorAll<HTMLButtonElement>(".pastille[data-value]"),
  );
  const facetteDe = (b: HTMLElement): string =>
    b.closest<HTMLElement>("[data-facette]")?.dataset.facette ?? "";
  const modeDe = (name: string): string =>
    form.querySelector<HTMLElement>(`[data-facette="${name}"]`)?.dataset.mode ??
    "single";
  const setPresse = (b: HTMLButtonElement, on: boolean): void =>
    b.setAttribute("aria-pressed", on ? "true" : "false");
  const actifs = (name: string): string[] =>
    pastilles
      .filter(
        (b) =>
          facetteDe(b) === name && b.getAttribute("aria-pressed") === "true",
      )
      .map((b) => b.dataset.value ?? "");
  const appliquer = (name: string, values: string[]): void => {
    const s = new Set(values);
    pastilles
      .filter((b) => facetteDe(b) === name)
      .forEach((b) => setPresse(b, s.has(b.dataset.value ?? "")));
  };

  // hydratation depuis l'URL (le query param l'emporte sur le bloc de la page)
  const p = new URLSearchParams(location.search);
  q.value = p.get("q") ?? "";
  appliquer(
    "bloc",
    p.has("bloc") ? p.getAll("bloc") : seedBloc ? [seedBloc] : [],
  );
  appliquer("type", p.getAll("type"));
  appliquer("statut", p.getAll("statut"));
  appliquer("transverse", p.getAll("transverse"));

  const lire = (): Filtres => ({
    q: q.value.trim().toLowerCase(),
    bloc: actifs("bloc")[0] ?? "",
    type: actifs("type")[0] ?? "",
    statut: actifs("statut")[0] ?? "",
    axes: actifs("transverse"),
  });

  const passe = (r: Row, f: Filtres): boolean => {
    if (f.bloc && r.bloc !== f.bloc) return false;
    if (f.type && r.type !== f.type) return false;
    if (f.statut && r.statut !== f.statut) return false;
    // OR à l'intérieur de l'axe transversal, AND entre facettes
    if (f.axes.length && !f.axes.some((a) => r.transverses.includes(a)))
      return false;
    if (f.q) {
      const foin = `${r.cote} ${r.titre} ${r.resume} ${r.texte}`.toLowerCase();
      for (const tok of f.q.split(/\s+/)) if (!foin.includes(tok)) return false;
    }
    return true;
  };

  const inverse = (r: Row): { label: string; items: Row[] } => {
    if (r.type === "principe") {
      return {
        label: `${tProvenBy} `,
        items: rows.filter((x) => x.type === "cas" && x.prouve.includes(r.id)),
      };
    }
    return {
      label: `${tProves} `,
      items: r.prouve
        .map((id) => byId.get(id))
        .filter((x): x is Row => Boolean(x)),
    };
  };

  const itemHtml = (r: Row): string => {
    const inv = inverse(r);
    const invHtml = inv.items.length
      ? `<p class="fiche-liens">${esc(inv.label)}${inv.items
          .map((x) => `<a href="${url(x.url)}">${esc(x.cote)}</a>`)
          .join(", ")}</p>`
      : "";
    const axesHtml = r.transverses
      .map((t) => `<span class="tag axe">${esc(lbl(opt.axe, t))}</span>`)
      .join("");
    return `<li>
      <a class="fiche-lien" href="${url(r.url)}"><span class="cote">${esc(r.cote)}</span><span class="fiche-titre">${esc(r.titre)}</span></a>
      <p class="fiche-resume">${esc(r.resume)}</p>
      <p class="fiche-meta"><span class="tag statut statut-${esc(r.statut)}">${esc(lbl(opt.statut, r.statut))}</span><span class="tag type">${esc(lbl(opt.type, r.type))}</span>${axesHtml}</p>
      ${invHtml}
    </li>`;
  };

  const syncUrl = (f: Filtres): void => {
    const sp = new URLSearchParams();
    if (f.q) sp.set("q", f.q);
    if (f.bloc) sp.set("bloc", f.bloc);
    if (f.type) sp.set("type", f.type);
    if (f.statut) sp.set("statut", f.statut);
    f.axes.forEach((a) => sp.append("transverse", a));
    const qs = sp.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  };

  const rendre = (): void => {
    const f = lire();
    const out = rows
      .filter((r) => passe(r, f))
      .sort(
        (a, b) =>
          BLOC_ORDER.indexOf(a.bloc) - BLOC_ORDER.indexOf(b.bloc) ||
          a.cote.localeCompare(b.cote),
      );
    liste.innerHTML =
      out.map(itemHtml).join("") ||
      `<li class="liste-vide">${esc(tEmpty)}</li>`;
    compte.textContent = compteTexte(out.length);
    syncUrl(f);
  };

  let t: ReturnType<typeof setTimeout> | undefined;
  q.addEventListener("input", () => {
    if (t) clearTimeout(t);
    t = setTimeout(rendre, 120);
  });

  pastilles.forEach((btn) =>
    btn.addEventListener("click", () => {
      const name = facetteDe(btn);
      const presse = btn.getAttribute("aria-pressed") === "true";
      if (modeDe(name) === "single") {
        // groupe à choix unique : un clic sur la pastille active la désactive
        pastilles
          .filter((b) => facetteDe(b) === name)
          .forEach((b) => setPresse(b, false));
        setPresse(btn, !presse);
      } else {
        setPresse(btn, !presse);
      }
      rendre();
    }),
  );

  form.addEventListener("submit", (e) => e.preventDefault());
  form
    .querySelector<HTMLButtonElement>("[data-reset]")
    ?.addEventListener("click", () => {
      q.value = "";
      pastilles.forEach((b) => setPresse(b, false));
      rendre();
    });

  rendre();
}
