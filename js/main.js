/**
 * macOS Portfolio — Motion animations & interactions
 */

import { animate, stagger, inView } from 'https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm';

const SPRING = { type: 'spring', stiffness: 260, damping: 24 };
const SPRING_SOFT = { type: 'spring', stiffness: 180, damping: 22 };

// ---- Page init ----
function initPage() {
  document.body.classList.add('page-ready');

  initTypedRole();
  initClock();
  initDock();
  initTrafficLights();
  initParallax();
}

initPage();

// ---- Live Menu Bar Clock ----
function initClock() {
  const clockEl = document.getElementById('menu-clock');
  if (!clockEl) return;

  const update = () => {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    clockEl.textContent = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}  ${hour12}:${m} ${ampm}`;
  };

  update();
  setInterval(update, 30000);
}

// ---- Typed Role in Hero ----
function initTypedRole() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const el = document.getElementById('typed-role');
  if (!el) return;

  const roles = ['Flutter Developer', 'Mobile Architect', 'Full Stack Dev', 'UI/UX Builder'];
  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % roles.length;
    animate(el, { opacity: [1, 0], y: [0, -6] }, { duration: 0.18 }).then(() => {
      el.textContent = roles[idx];
      animate(el, { opacity: [0, 1], y: [6, 0] }, SPRING_SOFT);
    });
  }, 3200);
}

// ---- macOS Dock Magnification ----
function initDock() {
  const dock = document.getElementById('mac-dock');
  if (!dock) return;

  const items = dock.querySelectorAll('.dock-item');

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      animate(item, { scale: 1.35, y: -12 }, SPRING);
      const siblings = [...items];
      const i = siblings.indexOf(item);
      [-1, 1].forEach((offset) => {
        const neighbor = siblings[i + offset];
        if (neighbor) animate(neighbor, { scale: 1.15, y: -6 }, SPRING_SOFT);
      });
    });

    item.addEventListener('mouseleave', () => {
      animate(item, { scale: 1, y: 0 }, SPRING_SOFT);
      items.forEach((sib) => {
        if (sib !== item) animate(sib, { scale: 1, y: 0 }, SPRING_SOFT);
      });
    });

    item.addEventListener('click', () => {
      const icon = item.querySelector('.dock-icon');
      if (icon) animate(icon, { y: [0, -16, 0] }, { type: 'spring', stiffness: 500, damping: 20 });
    });
  });
}

// ---- Traffic Light Interactions ----
function initTrafficLights() {
  document.querySelectorAll('.mac-window').forEach((win) => {
    const close = win.querySelector('.tl-close');
    const minimize = win.querySelector('.tl-minimize');
    const maximize = win.querySelector('.tl-maximize');

    close?.addEventListener('click', () => {
      animate(win, { opacity: [1, 0], scale: [1, 0.92] }, { duration: 0.22 }).then(() => {
        animate(win, { opacity: [0, 1], scale: [0.92, 1] }, SPRING);
      });
    });

    minimize?.addEventListener('click', () => {
      animate(win, { scale: [1, 0.94], y: [0, 16], opacity: [1, 0.5] }, { duration: 0.28 }).then(() => {
        animate(win, { scale: [0.94, 1], y: [16, 0], opacity: [0.5, 1] }, SPRING);
      });
    });

    maximize?.addEventListener('click', () => {
      animate(win, { scale: [1, 1.02, 1] }, { type: 'spring', stiffness: 400, damping: 15 });
    });
  });
}

// ---- Desktop Parallax on Hero ----
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const windows = document.querySelectorAll('.floating-window');
  const macbook = document.querySelector('.macbook-screen');
  if (!macbook) return;

  macbook.addEventListener('mousemove', (e) => {
    const rect = macbook.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    windows.forEach((win) => {
      const depth = parseFloat(win.dataset.depth || '0.03');
      win.style.transform = `translate(${x * depth * 100}px, ${y * depth * 100}px)`;
    });
  });

  macbook.addEventListener('mouseleave', () => {
    windows.forEach((win) => {
      win.style.transform = '';
    });
  });
}

// ---- Scroll: Window Open Animations ----
document.querySelectorAll('.fade-in').forEach((el) => {
  const delay = parseInt(el.dataset.delay || '0', 10) / 1000;

  inView(
    el,
    () => {
      animate(
        el,
        { opacity: [0, 1], y: [40, 0], scale: [0.94, 1] },
        { delay, ...SPRING }
      );

      el.classList.add('visible');

      const apps = el.querySelectorAll('.launchpad-app');
      if (apps.length) {
        animate(apps, { opacity: [0, 1], scale: [0.5, 1] }, { delay: stagger(0.04, { start: delay + 0.15 }), ...SPRING_SOFT });
      }

      const phones = el.querySelectorAll('.iphone-device');
      if (phones.length) {
        animate(phones, { opacity: [0, 1], y: [50, 0], scale: [0.88, 1] }, { delay: stagger(0.1, { start: delay }), ...SPRING });
      }
    },
    { margin: '-50px 0px -50px 0px', amount: 0.12 }
  );
});

// ---- Active Dock & Menu Highlight ----
const sections = document.querySelectorAll('section[id]');
const dockItems = document.querySelectorAll('.dock-item[data-section]');
const menuItems = document.querySelectorAll('.menu-item');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        dockItems.forEach((item) => {
          item.classList.toggle('active', item.dataset.section === id);
        });

        menuItems.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${id}` ? '#007AFF' : '';
        });
      }
    });
  },
  { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
);

sections.forEach((s) => sectionObserver.observe(s));

// ---- Smooth Scroll ----
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Launchpad App Wiggle ----
document.querySelectorAll('.launchpad-app').forEach((app) => {
  app.addEventListener('click', () => {
    animate(app, { rotate: [0, -3, 3, -2, 2, 0] }, { duration: 0.45 });
  });
});

// ---- iPhone hover lift ----
document.querySelectorAll('.iphone-device').forEach((device) => {
  device.addEventListener('mouseenter', () => {
    const frame = device.querySelector('.iphone-frame');
    if (frame) animate(frame, { y: [0, -6] }, { duration: 0.35, ...SPRING_SOFT });
  });
  device.addEventListener('mouseleave', () => {
    const frame = device.querySelector('.iphone-frame');
    if (frame) animate(frame, { y: 0 }, { duration: 0.25 });
  });
});

// ---- Contact Form ----
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showFormStatus('Please fill in all fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormStatus('Please enter a valid email.', 'error');
    return;
  }

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  setTimeout(() => {
    showFormStatus('Message sent! I\'ll reply soon.', 'success');
    contactForm.reset();
    btn.disabled = false;
    btn.textContent = 'Send Message';
    animate(formStatus, { opacity: [0, 1], scale: [0.9, 1] }, SPRING_SOFT);
  }, 1200);
});

function showFormStatus(text, type) {
  formStatus.textContent = text;
  formStatus.classList.remove('hidden', 'success', 'error');
  formStatus.classList.add(type);
}

// ---- Notes Folder Tabs ----
document.querySelectorAll('.notes-folder').forEach((folder) => {
  folder.addEventListener('click', () => {
    document.querySelectorAll('.notes-folder').forEach((f) => f.classList.remove('active'));
    folder.classList.add('active');
    animate(folder, { scale: [1, 1.04, 1] }, { duration: 0.25 });
  });
});
