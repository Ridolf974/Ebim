/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Script principal (Redesign Light Pro)
   · Navigation sticky + burger + lien actif
   · Scroll reveal (.reveal → .visible)
   · Compteurs animés (trust-num + fstat__num)
   · Formulaire de contact
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Navigation ──────────────────────────────────────── */
  const nav      = document.getElementById('nav');
  const burger   = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');
  const links    = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    /* Fond nav au scroll */
    nav.classList.toggle('scrolled', window.scrollY > 60);

    /* Lien actif selon section visible */
    let current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    links.forEach(function (l) {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Burger mobile */
  if (burger) {
    burger.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    /* Fermer le menu au clic sur un lien */
    navLinks.querySelectorAll('.nav-link').forEach(function (l) {
      l.addEventListener('click', function () {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Scroll reveal ────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function (el) { revealObs.observe(el); });

  /* ── Compteurs animés ─────────────────────────────────── */
  function animCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';

    const target = parseInt(el.dataset.target, 10);
    const dur    = 1600;
    const start  = performance.now();

    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      /* easeOutExpo */
      const e = 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(e * target);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  /* Compteurs hero (.trust-num) — déclenchés au chargement après 500ms */
  const heroTrust = document.querySelector('.hero-trust');
  if (heroTrust) {
    setTimeout(function () {
      heroTrust.querySelectorAll('[data-target]').forEach(animCounter);
    }, 500);
  }

  /* Compteurs formations (.fstat__num) — déclenchés au scroll */
  const formationsStats = document.querySelector('.formations-stats');

  if (formationsStats) {
    const counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-target]').forEach(animCounter);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counterObs.observe(formationsStats);
  }

  /* ── Formulaire de contact ────────────────────────────── */
  const form   = document.getElementById('contact-form');
  const notice = document.getElementById('form-notice');

  if (form && notice) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nom     = form.querySelector('#nom').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!nom || !email || !message) {
        showNotice('Veuillez remplir tous les champs obligatoires (*).', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotice('Adresse email invalide.', 'error');
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      btn.disabled    = true;
      btn.textContent = 'Envoi…';

      /* TODO : connecter à un vrai backend (Formspree, Netlify Forms, API custom) */
      btn.disabled    = false;
      btn.textContent = 'Envoyer le message';
      showNotice('Le formulaire n\'est pas encore connecté. Veuillez nous contacter directement par email.', 'error');
    });
  }

  function showNotice(msg, type) {
    notice.textContent = msg;
    notice.className   = 'form-notice ' + type;
    setTimeout(function () {
      notice.textContent = '';
      notice.className   = 'form-notice';
    }, 6000);
  }

})();
