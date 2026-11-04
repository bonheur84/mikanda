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
    const accessParam = params.get("acces");
    if (accessParam && accessButtons.some((b) => b.dataset.filterAccess === accessParam)) {
      accessButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filterAccess === accessParam)));
    }

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

  /* ---------- Hero de l'accueil : la scène de bibliothèque suit le défilement ---------- */
  const hero = document.querySelector("[data-scroll-hero]");
  if (hero && window.MikandaScene && !reduceMotion.matches && "IntersectionObserver" in window) {
    const canvas = hero.querySelector("canvas");
    const ctx = canvas && canvas.getContext("2d");
    const stage = hero.querySelector(".scroll-hero__stage");
    const chapters = Array.from(hero.querySelectorAll("[data-chapter]"));
    const progressBar = hero.querySelector(".scroll-hero__progress");
    let target = 0;
    let current = -1;
    let running = false;
    let visible = true;

    if (ctx) {
      hero.classList.add("is-scrubbing");

      const size = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.round(rect.width * ratio);
        canvas.height = Math.round(rect.height * ratio);
        current = -1;
      };

      const draw = (p) => {
        window.MikandaScene.render(ctx, canvas.width, canvas.height, p, { wide: canvas.width / canvas.height > 1.1 });
      };

      const measure = () => {
        const rect = hero.getBoundingClientRect();
        const distance = hero.offsetHeight - stage.offsetHeight;
        target = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0;
        if (progressBar) progressBar.style.setProperty("--p", target.toFixed(4));
        const active = Math.min(chapters.length - 1, Math.floor(target * chapters.length * 0.999));
        chapters.forEach((chapter, index) => {
          const on = index === active;
          chapter.toggleAttribute("data-active", on);
          chapter.toggleAttribute("inert", !on);
        });
      };

      // Lissage : la caméra rattrape le défilement en douceur, sans à-coups.
      const tick = () => {
        current = current < 0 ? target : current + (target - current) * 0.16;
        if (Math.abs(target - current) < 0.0004) current = target;
        draw(current);
        if (current !== target && visible) window.requestAnimationFrame(tick);
        else running = false;
      };

      const request = () => {
        measure();
        if (!running && visible) {
          running = true;
          window.requestAnimationFrame(tick);
        }
      };

      size();
      request();
      hero.classList.add("is-ready");

      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) request();
      }).observe(hero);

      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", () => {
        size();
        request();
      });
      document.fonts?.ready.then(() => {
        current = -1;
        request();
      });

      // Un lien atteint au clavier dans un chapitre : on fait défiler jusqu'à lui.
      hero.addEventListener("focusin", (event) => {
        const chapter = event.target.closest("[data-chapter]");
        if (!chapter || chapter.hasAttribute("data-active")) return;
        const index = chapters.indexOf(chapter);
        const distance = hero.offsetHeight - stage.offsetHeight;
        window.scrollTo({ top: hero.offsetTop + (distance * (index + 0.5)) / chapters.length });
      });
    }
  }

  /* ---------- Vidéos d'ambiance : en pause si l'utilisateur limite les animations ---------- */
  document.querySelectorAll("video[data-ambient]").forEach((video) => {
    const apply = () => {
      if (reduceMotion.matches) video.pause();
      else video.play().catch(() => {});
    };
    reduceMotion.addEventListener("change", apply);
    apply();
  });

  /* ---------- Formulaires de démonstration (aucun serveur relié) ---------- */
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (status) {
        status.textContent = form.dataset.demoForm;
        status.focus();
      }
    });
    form.querySelectorAll("[data-demo-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (status) {
          status.textContent = button.dataset.demoAction;
          status.focus();
        }
      });
    });
  });

  /* ---------- Afficher / masquer un mot de passe ---------- */
  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    const input = document.getElementById(button.getAttribute("aria-controls"));
    if (!input) return;
    button.hidden = false;
    button.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-pressed", String(show));
      button.setAttribute("aria-label", show ? "Masquer le mot de passe" : "Afficher le mot de passe");
    });
  });

  /* ---------- Listes filtrables (auteurs, tableaux de l'administration) ---------- */
  document.querySelectorAll("[data-filter-list]").forEach((scope) => {
    const items = Array.from(scope.querySelectorAll("[data-item]"));
    const inputs = Array.from(scope.querySelectorAll("[data-filter]"));
    const counter = scope.querySelector("[data-filter-total]");
    const emptyState = scope.querySelector("[data-filter-none]");
    const fold = (value) => (value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
    const label = counter ? counter.dataset.filterTotal : "";

    const apply = () => {
      let shown = 0;
      items.forEach((item) => {
        const ok = inputs.every((input) => {
          const value = fold(input.value);
          if (!value || value === "all") return true;
          const key = input.dataset.filter;
          if (key === "text") return fold(item.textContent).includes(value);
          return fold(item.dataset[key]) === value;
        });
        item.hidden = !ok;
        if (ok) shown += 1;
      });
      if (counter) counter.textContent = `${shown} ${shown === 1 && counter.dataset.filterOne ? counter.dataset.filterOne : label}`;
      if (emptyState) emptyState.hidden = shown !== 0;
    };

    inputs.forEach((input) => input.addEventListener(input.tagName === "SELECT" ? "change" : "input", apply));
    const form = scope.querySelector("form");
    if (form) form.addEventListener("submit", (event) => {
      event.preventDefault();
      apply();
    });
    const params = new URLSearchParams(window.location.search);
    const text = inputs.find((input) => input.dataset.filter === "text");
    if (text && params.get("q")) text.value = params.get("q");
    apply();
  });

  /* ---------- Messagerie de l'administration ---------- */
  const inbox = document.querySelector("[data-inbox]");
  if (inbox) {
    const tabs = Array.from(inbox.querySelectorAll("[data-message]"));
    const panes = Array.from(inbox.querySelectorAll("[data-pane]"));
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.setAttribute("aria-current", String(t === tab)));
        panes.forEach((pane) => {
          pane.hidden = pane.dataset.pane !== tab.dataset.message;
        });
        tab.querySelector("[data-unread]")?.remove();
      });
    });
  }

  refreshIcons();
})();
