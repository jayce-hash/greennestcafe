(() => {
  // ---- Nav ----
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = document.querySelector(".hamburger");
  const links = document.getElementById("nav-links");
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger?.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && links?.classList.contains("open") && setMenu(false));

  // ---- Open now (always in the cafe's time zone) ----
  const status = document.querySelector(".status");
  if (status) {
    try {
      const hours = JSON.parse(status.dataset.hours);
      const parts = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "long", hour: "numeric", minute: "numeric", hourCycle: "h23" })
          .formatToParts(new Date())
          .map((p) => [p.type, p.value])
      );
      const order = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const mins = (t) => { const [h, m] = String(t).split(":").map(Number); return h * 60 + (m || 0); };
      const fmt = (t) => { const [h, m] = String(t).split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; const hh = h % 12 || 12; return m ? `${hh}:${String(m).padStart(2, "0")} ${ap}` : `${hh} ${ap}`; };
      const now = (+parts.hour % 24) * 60 + +parts.minute;
      const byDay = Object.fromEntries(hours.map((d) => [d.d, d]));
      const today = byDay[parts.weekday];
      let text, open = false;
      if (today && !today.x && today.o && today.c && now >= mins(today.o) && now < mins(today.c)) {
        open = true;
        text = `Open now until ${fmt(today.c)}`;
      } else {
        // find the next opening time
        const idx = order.indexOf(parts.weekday);
        for (let k = 0; k < 8; k++) {
          const day = byDay[order[(idx + k) % 7]];
          if (!day || day.x || !day.o) continue;
          if (k === 0 && now >= mins(day.o)) continue;
          text = `Closed now. Opens ${k === 0 ? "today" : k === 1 ? "tomorrow" : order[(idx + k) % 7]} at ${fmt(day.o)}`;
          break;
        }
      }
      if (text) {
        status.querySelector(".status-text").textContent = text;
        status.classList.toggle("closed", !open);
        status.hidden = false;
      }
      document.querySelector(`.hours tr[data-day="${parts.weekday}"]`)?.classList.add("today");
    } catch {}
  }

  // ---- Menu tabs ----
  const tabs = [...document.querySelectorAll(".menu-tabs [role=tab]")];
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") select(tabs[(i + 1) % tabs.length], true);
      if (e.key === "ArrowLeft") select(tabs[(i - 1 + tabs.length) % tabs.length], true);
    });
  });

  // ---- Photos: filters, show more, lightbox ----
  const grid = document.querySelector(".grid");
  if (grid) {
    const PAGE = parseInt(grid.dataset.page, 10) || 12;
    const tiles = [...grid.querySelectorAll(".tile")];
    const more = document.querySelector(".more");
    let filter = "all", limit = PAGE;
    const matching = () => tiles.filter((t) => filter === "all" || t.dataset.cat === filter);
    const update = () => {
      const m = matching();
      tiles.forEach((t) => (t.hidden = true));
      m.slice(0, limit).forEach((t) => (t.hidden = false));
      const left = m.length - limit;
      more.hidden = left <= 0;
      if (left > 0) more.textContent = `Show more photos (${left})`;
    };
    document.querySelectorAll(".chip").forEach((chip) =>
      chip.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        filter = chip.dataset.filter;
        limit = PAGE;
        update();
      })
    );
    more?.addEventListener("click", () => {
      const first = matching()[limit];
      limit += PAGE;
      update();
      first?.querySelector("button")?.focus({ preventScroll: true });
    });
    update();

    const dlg = document.querySelector(".lightbox");
    const img = dlg.querySelector("img");
    const cap = dlg.querySelector("figcaption");
    let list = [], idx = 0;
    const show = (i) => {
      idx = (i + list.length) % list.length;
      const thumb = list[idx].querySelector("img");
      img.src = list[idx].dataset.full;
      img.alt = thumb.alt;
      cap.textContent = thumb.alt;
    };
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".tile-btn");
      if (!btn) return;
      list = matching().map((t) => t.querySelector(".tile-btn"));
      show(list.indexOf(btn));
      dlg.showModal();
    });
    dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
    dlg.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
    dlg.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
    dlg.addEventListener("click", (e) => e.target === dlg && dlg.close());
    dlg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let x0 = null;
    dlg.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    dlg.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }
})();
