// Quiz page — one question at a time, in-memory scoring, no storage.
// Consumes src/content/quiz.json (embedded in the page as application/json).
// Reuses the existing filter pills (.pastille) and design tokens; no framework.

interface Q {
  id: string;
  question: string;
  options: string[];
  correct_answer: string | string[];
  explanation: string;
  type: "single" | "multiple";
  section: string;
  maps_to_card: string;
  week: string;
}

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

export function initQuiz(): void {
  const root = document.querySelector<HTMLElement>("[data-quiz]");
  const dataEl = document.querySelector<HTMLElement>("[data-quiz-data]");
  const form = root?.querySelector<HTMLElement>("[data-quiz-filtres]");
  const scoreEl = root?.querySelector<HTMLElement>("[data-quiz-score]");
  const cardEl = root?.querySelector<HTMLElement>("[data-quiz-card]");
  if (!root || !dataEl || !form || !scoreEl || !cardEl) return;

  let all: Q[] = [];
  try {
    all = JSON.parse(dataEl.textContent || "[]") as Q[];
  } catch {
    return;
  }
  if (!all.length) return;

  const lang = root.dataset.lang ?? "en";
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const prefixe = lang && lang !== "en" ? `/${lang}` : "";
  const cardUrl = (section: string, id: string) =>
    `${base}${prefixe}/${section}/${id}/`;

  let S: Record<string, string> = {};
  try {
    S = JSON.parse(root.dataset.t ?? "{}") as Record<string, string>;
  } catch {
    /* fall back to keys */
  }
  const t = (k: string, vars?: Record<string, string | number>): string => {
    let s = S[k] ?? k;
    if (vars)
      for (const [vk, vv] of Object.entries(vars))
        s = s.replace(`{${vk}}`, String(vv));
    return s;
  };

  const pills = Array.from(
    form.querySelectorAll<HTMLButtonElement>(".pastille[data-value]"),
  );
  const selectedSections = (): string[] =>
    pills
      .filter((p) => p.getAttribute("aria-pressed") === "true")
      .map((p) => p.dataset.value ?? "");

  const correctSet = (q: Q): Set<string> =>
    new Set(
      Array.isArray(q.correct_answer) ? q.correct_answer : [q.correct_answer],
    );

  const state = {
    pool: all.slice(),
    idx: 0,
    answered: 0,
    correct: 0,
    revealed: false,
    picks: new Set<string>(),
  };

  const renderScore = (): void => {
    scoreEl.textContent = t("score", { a: state.answered, c: state.correct });
  };

  const rebuildPool = (): void => {
    const sel = selectedSections();
    state.pool = sel.length
      ? all.filter((q) => sel.includes(q.section))
      : all.slice();
    state.idx = 0;
    state.answered = 0;
    state.correct = 0;
    state.revealed = false;
    state.picks.clear();
    render();
  };

  const isRight = (q: Q): boolean => {
    const cs = correctSet(q);
    return (
      state.picks.size === cs.size && [...state.picks].every((p) => cs.has(p))
    );
  };

  // Update option styling + Check button in place, without re-rendering
  // (keeps keyboard focus on the input the user just toggled).
  const refreshPicks = (): void => {
    cardEl
      .querySelectorAll<HTMLElement>(".quiz-option")
      .forEach((el) => {
        el.classList.toggle(
          "is-picked",
          state.picks.has(el.dataset.value ?? ""),
        );
      });
    const chk = cardEl.querySelector<HTMLButtonElement>("[data-check]");
    if (chk) chk.disabled = state.picks.size === 0;
  };

  const renderEnd = (): void => {
    renderScore();
    cardEl.innerHTML = `
      <p class="quiz-verdict ok">${esc(
        t("end", { c: state.correct, n: state.answered }),
      )}</p>
      <div class="quiz-actions">
        <button type="button" class="quiz-btn secondary" data-restart>${esc(
          t("restart"),
        )}</button>
      </div>`;
    cardEl.querySelector("[data-restart]")?.addEventListener("click", () => {
      state.idx = 0;
      state.answered = 0;
      state.correct = 0;
      state.revealed = false;
      state.picks.clear();
      render();
    });
  };

  const render = (): void => {
    renderScore();

    if (!state.pool.length) {
      cardEl.innerHTML = `<p class="quiz-empty">${esc(t("emptyPool"))}</p>`;
      return;
    }
    if (state.idx >= state.pool.length) {
      renderEnd();
      return;
    }

    const q = state.pool[state.idx];
    const cs = correctSet(q);
    const inputType = q.type === "multiple" ? "checkbox" : "radio";
    const hint =
      q.type === "multiple"
        ? `<p class="quiz-hint">${esc(t("selectN", { n: cs.size }))}</p>`
        : "";

    const opts = q.options
      .map((o) => {
        const picked = state.picks.has(o);
        let cls = "quiz-option";
        if (state.revealed) {
          cls += " revealed";
          if (cs.has(o)) cls += " is-correct";
          else if (picked) cls += " is-wrong";
        } else if (picked) {
          cls += " is-picked";
        }
        return `<label class="${cls}" data-value="${esc(o)}">
          <input type="${inputType}" name="opt" value="${esc(o)}"${
            picked ? " checked" : ""
          }${state.revealed ? " disabled" : ""} />
          <span>${esc(o)}</span>
        </label>`;
      })
      .join("");

    let reveal = "";
    if (state.revealed) {
      const ok = isRight(q);
      reveal += `<p class="quiz-verdict ${ok ? "ok" : "ko"}">${esc(
        ok ? t("correct") : t("incorrect"),
      )}</p>`;
      if (q.explanation)
        reveal += `<p class="quiz-expl">${esc(q.explanation)}</p>`;
      if (q.maps_to_card !== "(unmapped)")
        reveal += `<p class="quiz-cardlink"><a href="${cardUrl(
          q.section,
          q.maps_to_card,
        )}">${esc(t("seeCard"))}</a></p>`;
    }

    const actions = state.revealed
      ? `<button type="button" class="quiz-btn" data-next>${esc(
          t("next"),
        )}</button>`
      : `<button type="button" class="quiz-btn" data-check${
          state.picks.size ? "" : " disabled"
        }>${esc(t("check"))}</button>`;

    cardEl.innerHTML = `
      <p class="quiz-count">${state.idx + 1} / ${state.pool.length}</p>
      <p class="quiz-q">${esc(q.question)}</p>
      ${hint}
      <div class="quiz-options">${opts}</div>
      ${reveal}
      <div class="quiz-actions">${actions}</div>`;

    if (!state.revealed) {
      cardEl
        .querySelectorAll<HTMLInputElement>("input[name=opt]")
        .forEach((inp) => {
          inp.addEventListener("change", () => {
            if (inputType === "radio") {
              state.picks.clear();
              state.picks.add(inp.value);
            } else if (inp.checked) {
              state.picks.add(inp.value);
            } else {
              state.picks.delete(inp.value);
            }
            refreshPicks();
          });
        });
      cardEl.querySelector("[data-check]")?.addEventListener("click", () => {
        if (!state.picks.size) return;
        state.answered += 1;
        if (isRight(q)) state.correct += 1;
        state.revealed = true;
        render();
      });
    } else {
      cardEl.querySelector("[data-next]")?.addEventListener("click", () => {
        state.idx += 1;
        state.revealed = false;
        state.picks.clear();
        render();
      });
    }
  };

  pills.forEach((p) =>
    p.addEventListener("click", () => {
      const on = p.getAttribute("aria-pressed") === "true";
      p.setAttribute("aria-pressed", on ? "false" : "true");
      rebuildPool();
    }),
  );
  form
    .querySelector("[data-quiz-reset]")
    ?.addEventListener("click", () => {
      pills.forEach((p) => p.setAttribute("aria-pressed", "false"));
      rebuildPool();
    });
  form.addEventListener("submit", (e) => e.preventDefault());

  render();
}
