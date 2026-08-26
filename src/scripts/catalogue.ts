// Full-text search + stacking filters, client-side, over the /search.json index
// generated at build time. Filter state lives in the URL (query params) so the
// view is shareable — brief §5. No localStorage.

interface Row {
  id: string;
  cote: string;
  title: string;
  summary: string;
  section: string;
  type: string;
  status: string;
  crosscutting: string[];
  proves: string[];
  links: string[];
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

const BLOC_ORDER = ["governance", "prompts", "build", "evaluation", "cases"];

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
  // site base (GitHub Pages) + locale prefix
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const prefixe = lang && lang !== "en" ? `/${lang}` : "";
  const url = (u: string): string => base + prefixe + u;

  // localized strings passed in by the Astro component
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
    /* keep raw values */
  }
  const lbl = (map: Record<string, string>, k: string): string => map[k] ?? k;

  let rows: Row[] = [];
  try {
    const res = await fetch(`${base}/search.json`);
    rows = (await res.json()) as Row[];
  } catch {
    return; // keep the list rendered at build time
  }
  const byId = new Map(rows.map((r) => [r.id, r]));

  const q = form.querySelector<HTMLInputElement>("[name=q]");
  if (!q) return;

  // Filter pills (replace the native <select>/<checkbox> controls).
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

  // hydrate from the URL (the query param wins over the page's bloc)
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
    if (f.bloc && r.section !== f.bloc) return false;
    if (f.type && r.type !== f.type) return false;
    if (f.statut && r.status !== f.statut) return false;
    // OR within the cross-cutting axis, AND between facets
    if (f.axes.length && !f.axes.some((a) => r.crosscutting.includes(a)))
      return false;
    if (f.q) {
      const foin = `${r.cote} ${r.title} ${r.summary} ${r.texte}`.toLowerCase();
      for (const tok of f.q.split(/\s+/)) if (!foin.includes(tok)) return false;
    }
    return true;
  };

  const inverse = (r: Row): { label: string; items: Row[] } => {
    if (r.type === "principle") {
      return {
        label: `${tProvenBy} `,
        items: rows.filter((x) => x.type === "case" && x.proves.includes(r.id)),
      };
    }
    return {
      label: `${tProves} `,
      items: r.proves
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
    const axesHtml = r.crosscutting
      .map((t) => `<span class="tag axe">${esc(lbl(opt.axe, t))}</span>`)
      .join("");
    return `<li>
      <a class="fiche-lien" href="${url(r.url)}"><span class="cote">${esc(r.cote)}</span><span class="fiche-titre">${esc(r.title)}</span></a>
      <p class="fiche-resume">${esc(r.summary)}</p>
      <p class="fiche-meta"><span class="tag statut statut-${esc(r.status)}">${esc(lbl(opt.statut, r.status))}</span><span class="tag type">${esc(lbl(opt.type, r.type))}</span>${axesHtml}</p>
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
          BLOC_ORDER.indexOf(a.section) - BLOC_ORDER.indexOf(b.section) ||
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
        // single-choice group: clicking the active pill turns it off
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
