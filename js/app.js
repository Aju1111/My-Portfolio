/**
 * Muhsin PA — macOS / iOS portfolio
 *
 * Every app (About, Skills, Projects…) gets its own window, created from #win-tpl.
 *   desktop → draggable, resizable macOS windows that zoom out of the Dock
 *   phone   → one full-screen iOS app at a time, zooming out of its home-screen icon
 * The URL hash is the page of the focused window, so links and Back work.
 */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPhone = () => window.matchMedia('(max-width: 820px)').matches;
  const MENUBAR_H = 28;
  const EASE = 'cubic-bezier(.2,.9,.25,1)';

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } },
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const SITE_TITLE = document.title;
  const EMAIL = ($('a[href^="mailto:"]')?.getAttribute('href') || 'mailto:').slice(7);

  // =========================================================
  // Projects (data in js/projects.js) → list rows, home-screen icons and one page per project
  // =========================================================
  function renderProjects(list) {
    const icon = (p, cls) => `<span class="icon ${cls}" style="--g:${p.gradient}"><svg><use href="#${p.icon}"/></svg></span>`;

    const row = (r) => {
      const lead = r.dot ? `<i style="background:${r.dot}"></i>`
        : r.av ? `<span class="s-av" style="background:${r.av[1]}">${esc(r.av[0])}</span>`
        : r.logo ? `<span class="s-logo" style="background:${r.logo[1]}">${esc(r.logo[0])}</span>` : '';
      return `<div class="s-row">${lead}<div><b>${esc(r.t)}</b><small>${esc(r.s)}</small></div><em class="${r.ok ? 'ok' : ''}">${esc(r.badge)}</em></div>`;
    };

    const screen = (sc) => {
      let h = '';
      if (sc.hello) h += `<div class="s-top"><div><p class="s-muted">${esc(sc.hello)}</p><p class="s-h">${esc(sc.title)}</p></div>${sc.avatar ? `<span class="s-av" style="background:${sc.avatar[1]}">${esc(sc.avatar[0])}</span>` : ''}</div>`;
      else if (sc.title) h += `<p class="s-h">${esc(sc.title)}</p>`;
      if (sc.large) h += `<p class="s-h s-h-lg">${esc(sc.large)}</p>`;
      if (sc.scan) h += '<div class="s-scan"><span></span></div>';
      if (sc.qr) h += '<div class="s-qr"><svg><use href="#g-qr"/></svg></div>';
      if (sc.map) h += '<div class="s-map"><i class="route"></i><i class="pin-a"></i><i class="pin-b"></i></div>';
      if (sc.muted) h += `<p class="s-muted">${esc(sc.muted)}</p>`;
      if (sc.search) h += `<div class="s-search"><svg><use href="#g-search"/></svg>${esc(sc.search)}</div>`;
      if (sc.chips) h += `<div class="s-chips">${sc.chips.map((c, i) => `<span class="${i === 0 ? 'on' : ''}">${esc(c)}</span>`).join('')}</div>`;
      if (sc.stats) h += `<div class="s-stats">${sc.stats.map(([v, l]) => `<span><b>${esc(v)}</b>${esc(l)}</span>`).join('')}</div>`;
      if (sc.section) h += `<p class="s-sec">${esc(sc.section)}</p>`;
      if (sc.rows) h += sc.rows.map(row).join('');
      if (sc.note) h += `<div class="s-note">${esc(sc.note)}</div>`;
      if (sc.btn) h += `<div class="s-btn ${sc.green ? 's-btn-green' : ''}">${esc(sc.btn)}</div>`;
      if (sc.tabs) h += `<div class="s-tabs">${sc.tabs.map((t, i) => `<span class="${i === sc.tab ? 'on' : ''}">${esc(t)}</span>`).join('')}</div>`;
      return `<div class="iphone"><div class="screen"><div class="scr ${sc.center ? 'scr-center' : ''}">${h}</div></div></div>`;
    };

    // Web projects: a small browser window with a sidebar, stat tiles and a table or bar chart
    const browser = (sc) => {
      const nav = sc.nav.map((n, i) => `<span class="${i === sc.active ? 'on' : ''}">${esc(n)}</span>`).join('');
      const stats = sc.stats.map(([v, l]) => `<div><b>${esc(v)}</b><small>${esc(l)}</small></div>`).join('');
      let body = '';
      if (sc.kind === 'table') {
        body = `<div class="br-table"><div class="br-tr br-th">${sc.cols.map((c) => `<span>${esc(c)}</span>`).join('')}</div>${
          sc.rows.map((r) => `<div class="br-tr">${r.map((c, i) => `<span class="${i === r.length - 1 ? `br-pill ${/Qualified|Won/.test(c) ? 'ok' : ''}` : ''}">${esc(c)}</span>`).join('')}</div>`).join('')}</div>`;
      } else {
        body = `<div class="br-bars">${sc.bars.map(([l, v]) => `<div class="br-bar-row"><small>${esc(l)}</small><i style="width:${v}%"></i></div>`).join('')}</div>`;
      }
      return `<div class="browser"><div class="br-top"><span class="br-dots"><i></i><i></i><i></i></span><span class="br-url">crm · ${esc(sc.title)}</span></div>
        <div class="br-main"><aside class="br-side">${nav}</aside><div class="br-content"><p class="br-h">${esc(sc.title)}</p><div class="br-stats">${stats}</div>${body}</div></div></div>`;
    };

    const actions = (p) => {
      let a = '';
      if (p.demo) a += `<a href="${esc(p.demo)}" target="_blank" rel="noopener" class="pill pill-blue">Live Demo</a>`;
      if (p.source) a += `<a href="${esc(p.source)}" target="_blank" rel="noopener" class="pill"><svg><use href="#g-github"/></svg>Source</a>`;
      if (!a) a = '<a href="#contact" class="pill pill-blue">Request a demo</a>';
      return a;
    };

    const container = $('#pages');
    list.forEach((p, i) => {
      const next = list[(i + 1) % list.length];
      const section = document.createElement('section');
      section.className = 'page';
      Object.assign(section.dataset, { page: `project-${p.id}`, title: p.short, app: 'projects', parent: 'projects' });
      section.innerHTML = `
        <header class="product-head">
          ${icon(p, 'icon-product')}
          <div>
            <h1 class="product-name">${esc(p.name)}</h1>
            <p class="product-sub">${esc(p.tagline)}</p>
            <p class="product-date">${esc(p.date)} · ${esc(p.platforms || (p.web ? 'Web app' : 'Android & iOS'))} · Cloud Native IT Solutions</p>
            <div class="product-actions">${actions(p)}</div>
          </div>
        </header>
        <div class="info-strip">${p.info.map(([k, b, s]) => `<div><small>${esc(k)}</small><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join('')}</div>
        <h2 class="section-title">Preview</h2>
        <div class="shots">${p.screens.map(p.web ? browser : screen).join('')}</div>
        <h2 class="section-title">About this app</h2>
        <p class="product-text">${esc(p.description)}</p>
        <div class="group group-list">${p.features.map((f) => `<div class="row"><svg class="row-check"><use href="#g-check"/></svg><span class="row-main">${esc(f)}</span></div>`).join('')}</div>
        <div class="chips">${p.tech.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
        <a href="#project-${next.id}" class="next-link">Next app: ${esc(next.name)} <svg><use href="#g-chev-r"/></svg></a>`;
      container.appendChild(section);
    });

    $('#project-list').innerHTML = list.map((p) => `
      <a href="#project-${p.id}" class="row app-row">
        ${icon(p, 'icon-app')}
        <span class="app-row-text"><b>${esc(p.name)}</b><small>${esc(p.summary)} · ${esc(p.date)}</small></span>
        <span class="pill">View</span>
      </a>`).join('');

    $$('.desk-badge').forEach((b) => { b.textContent = list.length; });

    const jobApps = $('#job-apps');
    if (jobApps) {
      jobApps.innerHTML = list.map((p) =>
        `<a href="#project-${p.id}" class="job-app">${icon(p, '')}<span>${esc(p.short)}</span></a>`).join('');
    }

    $('#ios-grid').insertAdjacentHTML('beforeend', list.map((p) =>
      `<a href="#project-${p.id}" class="ios-app">${icon(p, '')}<span>${esc(p.short)}</span></a>`).join(''));
  }

  renderProjects(window.PROJECTS || []);
  const pages = Object.fromEntries($$('#pages .page').map((p) => [p.dataset.page, p]));
  const appName = (app) => $(`.dock-item[data-app="${app}"]`)?.dataset.label || app;

  // ---------- Toast ----------
  let toastTimer;
  function toast(text) {
    const el = $('#toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  // =========================================================
  // Appearance & wallpaper (Control Center)
  // =========================================================
  function applyTheme(theme) {
    if (theme !== 'light') theme = 'dark'; // two appearances: Light and Dark (default)
    document.documentElement.dataset.theme = theme;
    $$('[data-theme-set]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.themeSet === theme)));
    store.set('mp_theme', theme);
  }
  function applyWall(wall) {
    document.body.dataset.wall = wall;
    $$('[data-wall-set]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.wallSet === wall)));
    store.set('mp_wall', wall);
  }
  applyTheme(store.get('mp_theme', 'dark'));
  applyWall(store.get('mp_wall', 'sunset'));
  $$('[data-theme-set]').forEach((b) => b.addEventListener('click', () => applyTheme(b.dataset.themeSet)));
  $$('[data-wall-set]').forEach((b) => b.addEventListener('click', () => applyWall(b.dataset.wallSet)));

  // =========================================================
  // Clock
  // =========================================================
  function tick() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const fmt = (o) => now.toLocaleDateString([], o);
    const values = {
      menubar: `${fmt({ weekday: 'short' })} ${fmt({ day: 'numeric', month: 'short' })}  ${time}`,
      day: fmt({ weekday: 'long' }),
      time: time.replace(/\s?[AP]M$/i, ''),
      date: fmt({ day: 'numeric', month: 'long' }),
      longdate: fmt({ weekday: 'long', day: 'numeric', month: 'long' }),
    };
    $$('[data-clock]').forEach((el) => { el.textContent = values[el.dataset.clock] || ''; });
  }
  tick();
  setInterval(tick, 15000);

  // Analog clock widget: 60 tick marks, hands updated every second
  const face = $('.clock-face');
  if (face) {
    const NS = 'http://www.w3.org/2000/svg';
    const ticks = $('.cf-ticks', face);
    for (let i = 0; i < 60; i++) {
      const major = i % 5 === 0;
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', '50'); line.setAttribute('x2', '50');
      line.setAttribute('y1', '4.5'); line.setAttribute('y2', major ? '9.5' : '7');
      line.setAttribute('transform', `rotate(${i * 6} 50 50)`);
      if (major) line.setAttribute('class', 'major');
      ticks.appendChild(line);
    }
    const hands = { h: $('.cf-h', face), m: $('.cf-m', face), s: $('.cf-s', face) };
    const moveHands = () => {
      const d = new Date();
      const s = d.getSeconds();
      const m = d.getMinutes() + s / 60;
      const h = (d.getHours() % 12) + m / 60;
      hands.h.setAttribute('transform', `rotate(${h * 30} 50 50)`);
      hands.m.setAttribute('transform', `rotate(${m * 6} 50 50)`);
      hands.s.setAttribute('transform', `rotate(${s * 6} 50 50)`);
    };
    moveHands();
    setInterval(moveHands, 1000);
  }

  // World clock: local time in Thrissur and Dubai
  const zones = $$('[data-tz]');
  if (zones.length) {
    const showZones = () => zones.forEach((el) => {
      try {
        el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.tz });
      } catch { el.textContent = ''; }
    });
    showZones();
    setInterval(showZones, 15000);
  }

  // =========================================================
  // Window manager
  // =========================================================
  const wins = {};        // app -> { app, el, body, page, state: 'closed' | 'open' | 'min' }
  let zTop = 40;
  let cascade = 0;
  let focused = null;
  let lastClicked = null; // element the user clicked to open something (zoom origin)

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"], [data-open]');
    if (link) lastClicked = link;
  }, true);

  function iconFor(w) {
    if (isPhone()) {
      return $(`.ios-app[href="#${w.page?.dataset.page}"]`) || $(`.ios-app[href="#${w.app}"]`);
    }
    return $(`.dock-item[data-app="${w.app}"]`);
  }

  function zoomFrames(w, fromEl) {
    if (!fromEl || !fromEl.getClientRects().length) {
      return [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }];
    }
    const o = fromEl.getBoundingClientRect();
    const r = w.el.getBoundingClientRect();
    const dx = o.left + o.width / 2 - (r.left + r.width / 2);
    const dy = o.top + o.height / 2 - (r.top + r.height / 2);
    const s = Math.max(o.width / r.width, 0.04);
    return [
      { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(${s})` },
      { opacity: 1, transform: 'none' },
    ];
  }

  // Run a Web Animation, but never let a window get stuck mid-animation:
  // if it hasn't finished shortly after its duration, cancel it and jump to the end state.
  function play(el, frames, options, done) {
    let ended = false;
    const anim = el.animate(frames, options);
    const end = () => {
      if (ended) return;
      ended = true;
      anim.cancel();
      if (done) done();
    };
    anim.onfinish = end;
    setTimeout(end, options.duration + 250);
  }

  function placeWindow(el) {
    const vw = innerWidth, vh = innerHeight;
    const width = Math.min(1000, vw - 120);
    const height = Math.min(760, vh - MENUBAR_H - 116);
    const off = (cascade++ % 6) * 28;
    el.style.setProperty('--w', `${width}px`);
    el.style.setProperty('--h', `${height}px`);
    el.style.setProperty('--x', `${Math.max(8, Math.round((vw - width) / 2) - 70 + off)}px`);
    el.style.setProperty('--y', `${MENUBAR_H + 16 + off}px`);
  }

  function getWin(app) {
    if (wins[app]) return wins[app];
    const el = $('#win-tpl').content.firstElementChild.cloneNode(true);
    el.dataset.app = app;
    el.setAttribute('aria-label', appName(app));
    const body = $('.win-body', el);
    Object.values(pages).filter((p) => p.dataset.app === app).forEach((p) => body.appendChild(p));
    placeWindow(el);
    document.body.insertBefore(el, $('.dock'));

    const w = { app, el, body, page: null, state: 'closed' };
    wins[app] = w;
    wireWindow(w);
    return w;
  }

  function wireWindow(w) {
    const { el, body } = w;
    const bar = $('.win-bar', el);

    el.addEventListener('pointerdown', () => { if (focused !== w) focusWin(w, true); });

    el.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === 'close') closeWin(w, 'close');
      else if (action === 'minimize') closeWin(w, 'min');
      else if (action === 'maximize') toggleMax(w);
      else if (action === 'back') goBack(w);
    });

    bar.addEventListener('dblclick', (e) => { if (!e.target.closest('button')) toggleMax(w); });

    // Drag by the title bar
    let drag = null;
    bar.addEventListener('pointerdown', (e) => {
      if (isPhone() || e.button !== 0 || e.target.closest('button') || el.classList.contains('maximized')) return;
      const r = el.getBoundingClientRect();
      drag = { x: e.clientX, y: e.clientY, left: r.left, top: r.top };
      bar.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
    });
    bar.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const nx = Math.min(innerWidth - 120, Math.max(120 - el.offsetWidth, drag.left + e.clientX - drag.x));
      const ny = Math.min(innerHeight - 60, Math.max(MENUBAR_H, drag.top + e.clientY - drag.y));
      el.style.setProperty('--x', `${nx}px`);
      el.style.setProperty('--y', `${ny}px`);
    });
    const endDrag = () => { drag = null; el.classList.remove('dragging'); };
    bar.addEventListener('pointerup', endDrag);
    bar.addEventListener('pointercancel', endDrag);

    // iOS: small nav-bar title appears once the large title scrolls away
    body.addEventListener('scroll', () => el.classList.toggle('scrolled', body.scrollTop > 44), { passive: true });
  }

  function toggleMax(w) {
    if (isPhone()) return;
    const el = w.el;
    // Native CSS resize writes inline width/height — fold them into our vars first
    if (el.style.width) { el.style.setProperty('--w', el.style.width); el.style.width = ''; }
    if (el.style.height) { el.style.setProperty('--h', el.style.height); el.style.height = ''; }
    el.classList.toggle('maximized');
  }

  function showPage(w, page) {
    const prev = w.page;
    $$('.page.active', w.body).forEach((p) => p.classList.remove('active', 'from-right'));
    page.classList.add('active');
    if (prev && page.dataset.parent === prev.dataset.page) page.classList.add('from-right');
    w.page = page;

    const title = page.dataset.title;
    const parent = page.dataset.parent ? pages[page.dataset.parent] : null;
    $('.win-title', w.el).textContent = title;
    $('.ios-bar-title', w.el).textContent = title;
    $('.ios-back-label', w.el).textContent = parent ? parent.dataset.title : 'Home';
    $('.win-navbtn', w.el).disabled = !parent;

    const frame = $('iframe[data-src]', page);
    if (frame && !frame.src) frame.src = frame.dataset.src;

    w.body.scrollTop = 0;
    w.el.classList.remove('scrolled');
  }

  function openWin(w) {
    if (w.state === 'open') return;
    if (isPhone()) {
      // iOS shows one app at a time
      Object.values(wins).forEach((o) => { if (o !== w && o.state === 'open') { o.el.hidden = true; o.state = 'closed'; } });
    }
    const origin = lastClicked && !w.el.contains(lastClicked) ? lastClicked : iconFor(w);
    w.el.hidden = false;
    w.state = 'open';
    if (!reduceMotion) play(w.el, zoomFrames(w, origin), { duration: 460, easing: EASE });
    syncChrome();
  }

  function closeWin(w, mode) {
    if (w.state !== 'open') return;
    w.state = mode === 'min' ? 'min' : 'closed';
    const finish = () => {
      if (w.state === 'open') return; // reopened during the animation
      w.el.hidden = true;
      w.el.classList.remove('maximized');
    };
    if (reduceMotion) finish();
    else play(w.el, zoomFrames(w, iconFor(w)).reverse(), { duration: mode === 'min' ? 420 : 320, easing: 'cubic-bezier(.4,0,.6,1)' }, finish);

    if (focused === w) {
      focused = null;
      const next = topWindow();
      if (next) focusWin(next, true);
      else history.replaceState(null, '', location.pathname + location.search);
    }
    syncChrome();
  }

  function topWindow() {
    return Object.values(wins)
      .filter((o) => o.state === 'open')
      .sort((a, b) => Number(b.el.style.zIndex) - Number(a.el.style.zIndex))[0] || null;
  }

  function focusWin(w, updateHash) {
    focused = w;
    w.el.style.zIndex = String(++zTop);
    Object.values(wins).forEach((o) => o.el.classList.toggle('inactive', o !== w));
    if (updateHash && w.page && location.hash !== `#${w.page.dataset.page}`) {
      history.replaceState(null, '', `#${w.page.dataset.page}`);
    }
    syncChrome();
  }

  function syncChrome() {
    const anyOpen = Object.values(wins).some((o) => o.state === 'open');
    document.body.classList.toggle('app-open', anyOpen);
    $$('.dock-item[data-app]').forEach((d) => {
      const w = wins[d.dataset.app];
      d.classList.toggle('running', !!w && w.state !== 'closed');
    });
    $('.mb-app').textContent = focused ? appName(focused.app) : 'Muhsin PA';
    document.title = focused?.page ? `${focused.page.dataset.title} — Muhsin PA` : SITE_TITLE;
  }

  function goBack(w) {
    const parent = w.page?.dataset.parent;
    if (parent) location.hash = parent;
    else closeWin(w, 'close');
  }

  function closeAll() {
    Object.values(wins).forEach((w) => closeWin(w, 'close'));
  }

  // ---------- Router ----------
  function render() {
    const page = pages[decodeURIComponent(location.hash.slice(1))];
    if (!page) { closeAll(); return; }
    const w = getWin(page.dataset.app);
    if (w.page !== page) showPage(w, page);
    if (w.state !== 'open') openWin(w);
    focusWin(w, false);
    lastClicked = null;
  }
  window.addEventListener('hashchange', render);
  window.addEventListener('popstate', render);

  // Keep windows reachable when the browser is resized
  window.addEventListener('resize', () => {
    Object.values(wins).forEach(({ el }) => {
      const r = el.getBoundingClientRect();
      if (r.left > innerWidth - 120) el.style.setProperty('--x', `${innerWidth - 220}px`);
      if (r.top > innerHeight - 60) el.style.setProperty('--y', `${MENUBAR_H + 16}px`);
    });
  });

  // Dock bounce
  $$('.dock-item').forEach((item) => {
    item.addEventListener('click', () => {
      if (reduceMotion) return;
      item.classList.remove('bounce');
      void item.offsetWidth;
      item.classList.add('bounce');
    });
  });

  // =========================================================
  // Menus, Control Center, About This Portfolio
  // =========================================================
  const cc = $('#control-center');
  const ccBtn = $('.mb-icon[data-cmd="control-center"]');
  const aboutSheet = $('#about-sheet');

  function closeMenus() {
    $$('.dropdown').forEach((d) => { d.hidden = true; });
    $$('[data-menu]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    cc.hidden = true;
    ccBtn?.setAttribute('aria-expanded', 'false');
  }

  $$('[data-menu]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = document.getElementById(btn.dataset.menu);
      const wasOpen = !menu.hidden;
      if (!wasOpen && menu.id === 'cal-menu') renderCalendar(menu);
      closeMenus();
      menu.hidden = wasOpen;
      btn.setAttribute('aria-expanded', String(!wasOpen));
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown, #control-center, [data-cmd="control-center"]')) closeMenus();
    else if (e.target.closest('.dropdown a, .dropdown button')) closeMenus();
  });

  // Calendar dropdown (click the clock)
  function renderCalendar(el) {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const lead = (new Date(y, m, 1).getDay() + 6) % 7; // weeks start on Monday
    const days = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    const dows = [...Array(7)].map((_, i) => new Date(2024, 0, 1 + i).toLocaleDateString([], { weekday: 'narrow' }));

    let cells = dows.map((d) => `<span class="dow">${d}</span>`).join('');
    for (let i = lead; i > 0; i--) cells += `<span class="muted">${prevDays - i + 1}</span>`;
    for (let d = 1; d <= days; d++) cells += `<span class="${d === now.getDate() ? 'today' : ''}">${d}</span>`;
    const trail = (7 - ((lead + days) % 7)) % 7;
    for (let d = 1; d <= trail; d++) cells += `<span class="muted">${d}</span>`;

    el.innerHTML = `
      <div class="cal-head"><b>${now.toLocaleDateString([], { month: 'long' })}</b><span>${y}</span></div>
      <div class="cal-grid">${cells}</div>
      <p class="cal-foot">${now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</p>`;
  }

  // Wi-Fi (online / offline) and battery (only where the browser exposes it)
  const wifi = $('#mb-wifi');
  const syncWifi = () => {
    wifi.classList.toggle('offline', !navigator.onLine);
    wifi.title = navigator.onLine ? 'Connected' : 'Offline';
  };
  addEventListener('online', syncWifi);
  addEventListener('offline', syncWifi);
  syncWifi();

  if (navigator.getBattery) {
    navigator.getBattery().then((b) => {
      const el = $('#mb-batt');
      const batt = $('.batt', el);
      const sync = () => {
        const pct = Math.round(b.level * 100);
        batt.style.setProperty('--lvl', `${pct}%`);
        batt.classList.toggle('low', pct <= 20 && !b.charging);
        batt.classList.toggle('charging', b.charging);
        $('.batt-pct', el).textContent = `${pct}%`;
        el.title = b.charging ? 'Charging' : 'Battery';
        // Desktops without a battery report "full and charging" — hide it there, like a desktop Mac
        el.hidden = b.charging && b.level === 1 && b.chargingTime === 0;
      };
      b.addEventListener('levelchange', sync);
      b.addEventListener('chargingchange', sync);
      sync();
    }).catch(() => { /* unsupported: battery stays hidden */ });
  }

  // =========================================================
  // Spotlight
  // =========================================================
  const spot = $('#spotlight');
  const spInput = $('#sp-input');
  const spList = $('#sp-results');
  let spItems = [];
  let spMatches = [];
  let spIndex = 0;

  const makeIcon = (symbol, g) => `<span class="icon" style="--g:${g}"><svg><use href="#${symbol}"/></svg></span>`;

  function buildIndex() {
    const items = [];
    $$('.dock-item[data-app]').forEach((d) => items.push({
      group: 'Applications', title: d.dataset.label, sub: 'App', keywords: d.dataset.label, icon: $('.icon', d).outerHTML,
      run: () => { location.hash = d.dataset.app; },
    }));
    $$('.app-row').forEach((row) => items.push({
      group: 'Projects', title: $('b', row).textContent, sub: $('small', row).textContent, icon: $('.icon', row).outerHTML,
      run: () => { location.hash = row.getAttribute('href').slice(1); },
    }));
    $$('[data-page="skills"] .row').forEach((row) => items.push({
      group: 'Skills', title: $('.row-main', row).textContent, sub: $('.row-detail', row)?.textContent || '', icon: $('.icon', row).outerHTML,
      run: () => { location.hash = 'skills'; },
    }));
    const blue = 'linear-gradient(160deg,#6EC4FF,#1D7BF0)';
    const gray = 'linear-gradient(160deg,#A1A1A6,#5E5E63)';
    items.push(
      { group: 'Actions', title: 'Download Resume', sub: 'PDF', icon: makeIcon('g-download', 'linear-gradient(160deg,#FF7A7A,#E0303A)'), run: () => { const a = document.createElement('a'); a.href = 'assets/resume.pdf'; a.download = ''; a.click(); } },
      { group: 'Actions', title: 'Call Muhsin', sub: '+91 80896 97979', icon: makeIcon('g-phone', 'linear-gradient(160deg,#6EE787,#22B04B)'), run: () => { location.href = 'tel:+918089697979'; } },
      { group: 'Actions', title: 'Email Muhsin', sub: EMAIL, icon: makeIcon('g-mail', blue), run: () => { location.href = `mailto:${EMAIL}`; } },
      { group: 'Actions', title: 'Copy Email Address', sub: EMAIL, icon: makeIcon('g-copy', blue), run: copyEmail },
      { group: 'Actions', title: 'Open LinkedIn', sub: 'linkedin.com', icon: makeIcon('g-linkedin', 'linear-gradient(160deg,#2C8BEA,#0A5BB5)'), run: () => window.open($('.dock-item[data-label="LinkedIn"]').href, '_blank', 'noopener') },
      { group: 'Actions', title: 'Toggle Dark Mode', sub: 'Appearance', icon: makeIcon('g-toggles', gray), run: () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark') },
      { group: 'Actions', title: 'Lock Screen', sub: 'System', icon: makeIcon('g-bolt', gray), run: lock },
    );
    return items;
  }

  function searchSpot(q) {
    q = q.trim().toLowerCase();
    if (!q) return spItems.filter((i) => i.group === 'Applications' || ['Download Resume', 'Email Muhsin'].includes(i.title));
    const words = q.split(/\s+/);
    return spItems
      .map((i) => {
        const hay = (i.keywords || `${i.title} ${i.sub} ${i.group}`).toLowerCase();
        if (!words.every((w) => hay.includes(w))) return null;
        const t = i.title.toLowerCase();
        return { i, score: t.startsWith(q) ? 0 : t.includes(q) ? 1 : 2 };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score)
      .map((m) => m.i);
  }


  function renderSpot() {
    spMatches = searchSpot(spInput.value);
    spIndex = Math.min(spIndex, Math.max(0, spMatches.length - 1));
    if (!spMatches.length) {
      spList.innerHTML = `<li class="sp-empty">No results for “${esc(spInput.value.trim())}”</li>`;
      return;
    }
    // Keep groups together in a stable order
    const order = ['Applications', 'Projects', 'Skills', 'Actions'];
    spMatches.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
    let html = '';
    let group = '';
    spMatches.forEach((m, idx) => {
      if (m.group !== group) { group = m.group; html += `<li class="sp-group" role="presentation">${group}</li>`; }
      html += `<li class="sp-item" role="option" id="sp-${idx}" data-idx="${idx}" aria-selected="${idx === spIndex}">${m.icon}<b>${esc(m.title)}</b><small>${esc(m.sub)}</small></li>`;
    });
    spList.innerHTML = html;
    spInput.setAttribute('aria-activedescendant', `sp-${spIndex}`);
  }

  function selectSpot(idx) {
    spIndex = (idx + spMatches.length) % spMatches.length;
    $$('.sp-item', spList).forEach((li) => li.setAttribute('aria-selected', String(Number(li.dataset.idx) === spIndex)));
    $(`#sp-${spIndex}`)?.scrollIntoView({ block: 'nearest' });
    spInput.setAttribute('aria-activedescendant', `sp-${spIndex}`);
  }

  function runSpot(idx) {
    const item = spMatches[idx];
    if (!item) return;
    closeSpot();
    lastClicked = null;
    item.run();
  }

  function openSpot() {
    closeMenus();
    if (!spItems.length) spItems = buildIndex();
    spInput.value = '';
    spIndex = 0;
    spot.hidden = false;
    renderSpot();
    spInput.focus();
  }
  function closeSpot() { spot.hidden = true; }

  spInput.addEventListener('input', () => { spIndex = 0; renderSpot(); });
  spInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selectSpot(spIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selectSpot(spIndex - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); runSpot(spIndex); }
  });
  spList.addEventListener('mousemove', (e) => {
    const li = e.target.closest('.sp-item');
    if (li && Number(li.dataset.idx) !== spIndex) selectSpot(Number(li.dataset.idx));
  });
  spList.addEventListener('click', (e) => {
    const li = e.target.closest('.sp-item');
    if (li) runSpot(Number(li.dataset.idx));
  });
  spot.addEventListener('click', (e) => { if (e.target === spot) closeSpot(); });

  // =========================================================
  // Lock screen & welcome notification
  // =========================================================
  const lockEl = $('#lock');
  const notif = $('#notif');

  function lock() {
    closeMenus();
    closeSpot();
    lockEl.hidden = false;
    lockEl.classList.remove('unlocking');
    resetSlider();
    document.body.classList.add('locked');
    slider.focus();
  }

  function unlock() {
    if (lockEl.hidden || lockEl.classList.contains('unlocking')) return;
    session.set('mp_unlocked', '1');
    document.body.classList.remove('locked');
    if (reduceMotion) { lockEl.hidden = true; return finishUnlock(); }
    // Let the knob finish its slide, then fade the lock screen away
    slider.classList.add('done');
    knob.style.setProperty('--x', `${sliderMax()}px`);
    slider.style.setProperty('--fade', '0');
    setTimeout(() => {
      lockEl.classList.add('unlocking');
      setTimeout(() => { lockEl.hidden = true; }, 600);
    }, isPhone() ? 0 : 320);
    finishUnlock();
  }

  function finishUnlock() {
    if (!session.get('mp_welcomed')) {
      session.set('mp_welcomed', '1');
      setTimeout(showNotif, 900);
    }
  }

  function showNotif() {
    notif.hidden = false;
    notif.classList.remove('out');
    setTimeout(hideNotif, 7000);
  }
  function hideNotif() {
    if (notif.hidden) return;
    notif.classList.add('out');
    setTimeout(() => { notif.hidden = true; }, 350);
  }
  notif.addEventListener('click', hideNotif);

  // Slide-to-open knob (desktop): drag it right; short drags spring back
  const slider = $('#lock-slider');
  const knob = $('.ls-knob', slider);
  const sliderMax = () => slider.clientWidth - knob.offsetWidth - 10;
  let slide = null;
  let suppressClick = false;

  function resetSlider() {
    slider.classList.remove('done', 'dragging');
    knob.style.removeProperty('--x');
    slider.style.removeProperty('--fade');
  }

  slider.addEventListener('pointerdown', (e) => {
    if (isPhone() || e.button !== 0) return;
    e.stopPropagation();
    slide = { x: e.clientX, dx: 0, max: sliderMax() };
    try { slider.setPointerCapture(e.pointerId); } catch { /* keep dragging without capture */ }
    slider.classList.add('dragging');
  });
  slider.addEventListener('pointermove', (e) => {
    if (!slide) return;
    slide.dx = Math.min(slide.max, Math.max(0, e.clientX - slide.x));
    knob.style.setProperty('--x', `${slide.dx}px`);
    slider.style.setProperty('--fade', String(Math.max(0, 1 - (slide.dx / slide.max) * 1.4)));
  });
  const endSlide = () => {
    if (!slide) return;
    const { dx, max } = slide;
    slide = null;
    slider.classList.remove('dragging');
    suppressClick = dx > 6; // a real drag, not a click
    if (dx > max * 0.6) unlock();
    else resetSlider();
  };
  slider.addEventListener('pointerup', endSlide);
  slider.addEventListener('pointercancel', endSlide);

  // Swipe up (or tap / click) to unlock
  let swipeY = null;
  lockEl.addEventListener('pointerdown', (e) => { swipeY = e.clientY; });
  lockEl.addEventListener('pointerup', (e) => {
    if (swipeY !== null && swipeY - e.clientY > 40) unlock();
    swipeY = null;
  });
  lockEl.addEventListener('click', () => {
    if (suppressClick) { suppressClick = false; return; }
    unlock();
  });

  // =========================================================
  // Commands & keyboard
  // =========================================================
  function copyEmail() {
    const done = () => toast('Email address copied');
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(EMAIL).then(done, () => toast(EMAIL));
    else toast(EMAIL);
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-cmd]');
    if (!el) return;
    const cmd = el.dataset.cmd;
    if (cmd === 'spotlight') openSpot();
    else if (cmd === 'spotlight-close') closeSpot();
    else if (cmd === 'control-center') {
      const open = cc.hidden;
      closeMenus();
      cc.hidden = !open;
      el.setAttribute('aria-expanded', String(open));
    }
    else if (cmd === 'about-portfolio') aboutSheet.hidden = false;
    else if (cmd === 'about-close') aboutSheet.hidden = true;
    else if (cmd === 'lock') lock();
    else if (cmd === 'unlock') unlock();
    else if (cmd === 'copy-email') copyEmail();
  });
  aboutSheet.addEventListener('click', (e) => { if (e.target === aboutSheet) aboutSheet.hidden = true; });

  document.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;
    const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

    if (!lockEl.hidden) {
      if (!mod && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp')) { e.preventDefault(); unlock(); }
      return;
    }
    if (e.ctrlKey && e.metaKey && e.key.toLowerCase() === 'q') { e.preventDefault(); lock(); return; }
    if ((mod && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
      e.preventDefault();
      if (spot.hidden) openSpot(); else closeSpot();
      return;
    }
    if (e.key !== 'Escape') return;

    if (!spot.hidden) { closeSpot(); return; }
    if (!cc.hidden || $$('.dropdown').some((d) => !d.hidden)) { closeMenus(); return; }
    if (!aboutSheet.hidden) { aboutSheet.hidden = true; return; }
    if (typing) { document.activeElement.blur(); return; }
    if (focused) goBack(focused);
  });

  // =========================================================
  // Page features
  // =========================================================
  // Live demo links without a URL yet
  $$('[data-demo]').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (a.getAttribute('href')) return;
      e.preventDefault();
      toast('Live demo coming soon');
    });
  });

  // Contact form → opens the visitor's mail app with the message filled in
  const form = $('#contact-form');
  const status = $('#mail-status');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#c-name');
    const email = $('#c-email');
    const subject = $('#c-subject');
    const message = $('#c-message');

    const checks = [
      [name, name.value.trim() !== ''],
      [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())],
    ];
    checks.forEach(([input, ok]) => input.closest('.mail-row').classList.toggle('invalid', !ok));
    message.classList.toggle('invalid', message.value.trim() === '');

    if (checks.some(([, ok]) => !ok) || message.value.trim() === '') {
      status.className = 'mail-status error';
      status.textContent = 'Please add your name, a valid email and a message.';
      return;
    }

    const subj = subject.value.trim() || `Project inquiry from ${name.value.trim()}`;
    const text = `${message.value.trim()}\n\n— ${name.value.trim()} (${email.value.trim()})`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(text)}`;

    status.className = 'mail-status ok';
    status.textContent = 'Opening your mail app…';
  });
  $$('#contact-form input, #contact-form textarea').forEach((el) => {
    el.addEventListener('input', () => {
      el.closest('.mail-row')?.classList.remove('invalid');
      el.classList.remove('invalid');
    });
  });

  // =========================================================
  // Start
  // =========================================================
  render();
  // Lock screen on the first visit of a session — skipped for deep links like #projects
  if (!session.get('mp_unlocked') && !location.hash) lock();
})();
