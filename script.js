/* ═══════════════════════════════════════════════════════════
   eBIM Ingénierie — Script principal
   Fonctions : navigation, animations au scroll, compteurs, formulaire
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Navigation : scroll effect & burger ──────────────── */
  const navHeader = document.getElementById('nav-header');
  const navBurger = document.getElementById('nav-burger');
  const navLinks  = document.getElementById('nav-links');

  /* Ajoute la classe .scrolled dès que l'on dépasse 60px */
  function onScroll() {
    if (window.scrollY > 60) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  /* Burger menu (mobile) */
  navBurger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.classList.toggle('open', isOpen);
    navBurger.setAttribute('aria-expanded', isOpen);
  });

  /* Ferme le menu mobile au clic sur un lien */
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navBurger.classList.remove('open');
      navBurger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Lien actif selon la section visible ─────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link[data-section]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.id;
      }
    });
    navItems.forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  /* ── Animations au scroll (Intersection Observer) ────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          /* On arrête d'observer une fois révélé */
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── Compteurs animés (chiffres clés formations) ──────── */
  const statValues = document.querySelectorAll('.stat-value[data-target]');

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; /* ms */
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Easing : easeOutExpo */
      const eased    = 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  /* Lance les compteurs quand les stats sont visibles */
  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          statValues.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) {
    statsObserver.observe(statsRow);
  }

  /* ── Formulaire de contact (simulation d'envoi) ───────── */
  const form       = document.getElementById('contact-form');
  const formNotice = document.getElementById('form-notice');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Validation basique */
      const nom     = form.querySelector('#nom').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!nom || !email || !message) {
        showNotice('Veuillez remplir tous les champs obligatoires (*).', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showNotice('Veuillez entrer une adresse email valide.', 'error');
        return;
      }

      /* Simulation d'envoi */
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';

      setTimeout(function () {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer le message';
        showNotice('Message envoyé ! Nous vous répondrons dans les plus brefs délais.', 'success');
      }, 1200);
    });
  }

  function showNotice(msg, type) {
    formNotice.textContent = msg;
    formNotice.className   = 'form-notice ' + type;
    /* Efface la notice après 6 secondes */
    setTimeout(function () {
      formNotice.textContent = '';
      formNotice.className   = 'form-notice';
    }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── Initialisation ────────────────────────────────────── */
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* Applique l'état initial */

})();
