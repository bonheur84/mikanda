(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Icônes ---------- */
  const refreshIcons = () => {
    if (window.lucide) window.lucide.createIcons();
  };

  /* ---------- En-tête : léger changement d'état au défilement ---------- */
  const header = document.querySelector("[data-site-header]");
  if (header) {
    let ticking = false;
    const update = () => {
      ticking = false;
      header.toggleAttribute("data-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* ---------- Menu mobile (<details>) : Échap, clic extérieur, liens ---------- */
  document.querySelectorAll("details[data-menu]").forEach((menu) => {
    const summary = menu.querySelector("summary");
    const close = (returnFocus) => {
      if (!menu.open) return;
      menu.open = false;
      if (returnFocus && summary) summary.focus();
    };

    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    });

    document.addEventListener("click", (event) => {
      if (menu.open && !menu.contains(event.target)) close(false);
    });

    menu.querySelectorAll(".menu-panel a").forEach((link) => {
      link.addEventListener("click", () => close(false));
    });

    const desktop = window.matchMedia("(min-width: 1024px)");
    desktop.addEventListener("change", (event) => {
      if (event.matches) close(false);
    });
  });

  /* ---------- Apparitions au défilement ---------- */
  const sections = document.querySelectorAll(".reveal");

  // Sections sans éléments marqués : on marque leurs blocs de contenu
  // (titres, textes, cartes…) pour une apparition progressive.
  const AUTO_ITEMS = "h2, h3, p, blockquote, figure, form, article, li, img, details, a.btn";
  sections.forEach((section) => {
    if (section.querySelector("[data-reveal]")) return;
    const picks = [];
    section.querySelectorAll(AUTO_ITEMS).forEach((el) => {
      if (picks.length >= 16 || picks.some((p) => p.contains(el))) return;
      picks.push(el);
    });
    picks.forEach((el) => el.setAttribute("data-reveal", ""));
  });

  sections.forEach((section) => {
    section.querySelectorAll("[data-reveal]").forEach((item, index) => {
      item.style.setProperty("--i", String(Math.min(index, 8)));
    });
  });

  const showAll = () => {
    document.querySelectorAll(".reveal, .reveal-self").forEach((el) => el.classList.add("is-visible"));
  };

  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    showAll();
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });

    document.querySelectorAll(".reveal, .reveal-self").forEach((el) => observer.observe(el));

    // Un élément atteint au clavier ne doit jamais rester invisible.
    document.addEventListener("focusin", (event) => {
      const host = event.target.closest(".reveal, .reveal-self");
      if (host) host.classList.add("is-visible");
    });
  }
  window.addEventListener("beforeprint", showAll);

  /* ---------- Bandeau des partenaires ---------- */
  document.querySelectorAll(".partners-track").forEach((track) => {
    const group = track.querySelector(".partners-group");
    if (!group) return;

    const duplicate = group.cloneNode(true);
    duplicate.setAttribute("aria-hidden", "true");
    duplicate.querySelectorAll("img").forEach((image) => {
      image.alt = "";
    });
    duplicate.querySelectorAll("a, button").forEach((el) => el.setAttribute("tabindex", "-1"));
    track.append(duplicate);
  });

  // Logos hébergés chez les partenaires : si l'un ne répond plus, on le masque
  // proprement, le nom de l'institution reste affiché.
  document.querySelectorAll(".partners-group img").forEach((image) => {
    const hide = () => {
      image.hidden = true;
    };
    if (image.complete && image.naturalWidth === 0 && image.currentSrc) hide();
    else image.addEventListener("error", hide, { once: true });
  });

  document.querySelectorAll("[data-marquee-toggle]").forEach((button) => {
    const marquee = document.getElementById(button.getAttribute("aria-controls"));
    if (!marquee) return;
    const label = button.querySelector("[data-label]");
    button.hidden = false;
    button.addEventListener("click", () => {
      const paused = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!paused));
      marquee.toggleAttribute("data-paused", !paused);
      if (label) label.textContent = paused ? "Mettre en pause" : "Reprendre le défilement";
    });
  });

  /* ---------- Catalogue : recherche, filtres et pagination côté navigateur ---------- */
  const catalogue = document.querySelector("[data-catalogue]");
  if (catalogue) {
    const items = Array.from(catalogue.querySelectorAll("[data-book]"));
    const search = document.querySelector("[data-filter-q]");
    const genre = document.querySelector("[data-filter-genre]");
    const accessButtons = Array.from(document.querySelectorAll("[data-filter-access]"));
    const count = document.querySelector("[data-filter-count]");
    const empty = document.querySelector("[data-filter-empty]");
    const pager = document.querySelector("[data-pager]");
    const reset = document.querySelector("[data-filter-reset]");
    const pageSize = Number(catalogue.dataset.pageSize) || 8;
    let page = 1;

    const normalize = (value) =>
      (value || "")
        .toString()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim();

    const params = new URLSearchParams(window.location.search);
    if (search && params.get("q")) search.value = params.get("q");
    if (genre && params.get("genre")) genre.value = params.get("genre");

    const currentAccess = () => {
      const active = accessButtons.find((b) => b.getAttribute("aria-pressed") === "true");
      return active ? active.dataset.filterAccess : "all";
    };

    const matches = (item) => {
      const q = normalize(search ? search.value : "");
      const g = genre ? genre.value : "all";
      const a = currentAccess();
      const haystack = normalize(`${item.dataset.title} ${item.dataset.author} ${item.dataset.genre}`);
      return (!q || haystack.includes(q))
        && (g === "all" || item.dataset.genre === g)
        && (a === "all" || item.dataset.access === a);
    };

    const pageButton = (label, target, { current = false, disabled = false, icon } = {}) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = icon ? "btn btn-secondary btn-sm" : "chip min-w-10 justify-center";
      if (current) button.setAttribute("aria-current", "page");
      if (!icon) button.setAttribute("aria-pressed", String(current));
      button.disabled = disabled;
      if (disabled) button.classList.add("opacity-40", "pointer-events-none");
      button.innerHTML = icon === "prev"
        ? '<i data-lucide="arrow-left" aria-hidden="true"></i> Précédent'
        : icon === "next"
          ? 'Suivant <i data-lucide="arrow-right" aria-hidden="true"></i>'
          : label;
      if (!icon) button.setAttribute("aria-label", `Page ${label}`);
      button.addEventListener("click", () => {
        page = target;
        render();
        catalogue.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      });
      return button;
    };

    const render = () => {
      const visible = items.filter(matches);
      const pages = Math.max(1, Math.ceil(visible.length / pageSize));
      page = Math.min(page, pages);
      const start = (page - 1) * pageSize;
      const shown = new Set(visible.slice(start, start + pageSize));

      items.forEach((item) => {
        item.hidden = !shown.has(item);
      });

      if (count) {
        count.textContent = visible.length === 0
          ? "Aucun livre ne correspond"
          : `${visible.length} livre${visible.length > 1 ? "s" : ""}${pages > 1 ? ` · page ${page} sur ${pages}` : ""}`;
      }
      if (empty) empty.hidden = visible.length !== 0;

      if (pager) {
        pager.replaceChildren();
        pager.hidden = pages <= 1;
        if (pages > 1) {
          pager.append(pageButton("", page - 1, { icon: "prev", disabled: page === 1 }));
          for (let n = 1; n <= pages; n += 1) pager.append(pageButton(String(n), n, { current: n === page }));
          pager.append(pageButton("", page + 1, { icon: "next", disabled: page === pages }));
          refreshIcons();
        }
      }
    };

    const restart = () => {
      page = 1;
      render();
    };

    if (search) {
      search.addEventListener("input", restart);
      const form = search.closest("form");
      if (form) form.addEventListener("submit", (event) => {
        event.preventDefault();
        restart();
      });
    }
    if (genre) genre.addEventListener("change", restart);
    accessButtons.forEach((button) => {
      button.addEventListener("click", () => {
        accessButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        restart();
      });
    });
    if (reset) {
      reset.addEventListener("click", () => {
        if (search) search.value = "";
        if (genre) genre.value = "all";
        accessButtons.forEach((b, i) => b.setAttribute("aria-pressed", String(i === 0)));
        restart();
        if (search) search.focus();
      });
    }

    render();
  }

  refreshIcons();
})();
