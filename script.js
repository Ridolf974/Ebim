/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Script principal (Redesign)
   · Curseur custom
   · Navigation sticky + burger + lien actif
   · Split reveal Hero
   · Scroll reveal
   · Compteurs animés
   · Formulaire
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Curseur custom ──────────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    /* Le follower suit avec un léger retard */
    (function animFollower() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animFollower);
    })();
  }

  /* ── Navigation ──────────────────────────────────────── */
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const links  = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    /* Fond nav au scroll */
    nav.classList.toggle('scrolled', window.scrollY > 60);

    /* Lien actif */
    let current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Burger */
  burger.addEventListener('click', function () {
    const open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('.nav-link').forEach(function (l) {
    l.addEventListener('click', function () {
      links.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Split reveal Hero ────────────────────────────────── */
  /* Les éléments .split-reveal s'animent au chargement */
  function initHeroReveal() {
    document.querySelectorAll('.split-reveal').forEach(function (el) {
      setTimeout(function () {
        el.classList.add('visible');
      }, 80);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroReveal);
  } else {
    initHeroReveal();
  }

  /* ── Scroll reveal générique ──────────────────────────── */
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
  /* Tous les éléments avec data-target (hero + formations) */
  const counters = document.querySelectorAll('[data-target]');

  function animCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1600;
    const start  = performance.now();

    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      /* easeOutExpo */
      const e = 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(e * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        /* Anime tous les compteurs visibles dans la section */
        entry.target.querySelectorAll('[data-target]').forEach(animCounter);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  /* Lance les compteurs Hero au chargement */
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    setTimeout(function () {
      heroStats.querySelectorAll('[data-target]').forEach(animCounter);
    }, 700);
  }

  /* Lance les compteurs formations au scroll */
  const fStats = document.querySelector('.formations-stats');
  if (fStats) counterObs.observe(fStats);

  /* ── Formulaire de contact ────────────────────────────── */
  const form   = document.getElementById('contact-form');
  const notice = document.getElementById('form-notice');

  if (form) {
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
      btn.disabled = true;
      btn.textContent = 'Envoi…';

      setTimeout(function () {
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Envoyer le message';
        showNotice('Message envoyé ! Nous vous répondrons rapidement.', 'success');
      }, 1200);
    });
  }

  function showNotice(msg, type) {
    notice.textContent = msg;
    notice.className = 'form-notice ' + type;
    setTimeout(function () {
      notice.textContent = '';
      notice.className = 'form-notice';
    }, 6000);
  }

})();
