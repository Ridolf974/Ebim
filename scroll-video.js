/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Arrière-plan vidéo piloté par le scroll
   · 121 frames JPEG en arrière-plan fixé
   · Frame 1 en haut de page → Frame 121 au bas visible de Modélisation
   · Re-préchargement au retour d'onglet inactif
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const TOTAL_FRAMES = 121;
  const FRAME_PATH   = 'assets/videos/frames/frame-';
  const FRAME_EXT    = '.jpg';

  const bg = document.getElementById('scroll-video-bg');
  const endSection = document.getElementById('modelisation');
  if (!bg || !endSection) return;

  /* Construire les chemins */
  const srcs = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const num = String(i + 1).padStart(4, '0');
    srcs.push(FRAME_PATH + num + FRAME_EXT);
  }

  /* Pré-charger toutes les frames en mémoire (stockées pour éviter le GC) */
  let cache = [];
  function preloadFrames() {
    cache = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = srcs[i];
      cache.push(img);
    }
  }
  preloadFrames();

  /* Re-précharger quand l'onglet redevient actif (le navigateur
     libère les images décodées des onglets inactifs) */
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      preloadFrames();
      update();
    }
  });

  let currentIndex = 0;
  let ticking = false;

  /* Position absolue du bas de la section cible (remonte les offsetParent) */
  function getSectionBottom() {
    let top = 0;
    let el = endSection;
    while (el) {
      top += el.offsetTop || 0;
      el = el.offsetParent;
    }
    return top + endSection.offsetHeight;
  }

  function update() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    /* endPoint = scroll où le bas de #modelisation touche le bas du viewport */
    const endPoint = getSectionBottom() - window.innerHeight;
    if (endPoint <= 0) return;

    let progress = scrollTop / endPoint;
    progress = Math.max(0, Math.min(1, progress));

    const index = Math.min(Math.round(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

    if (index !== currentIndex) {
      currentIndex = index;
      bg.src = srcs[index];
    }

    ticking = false;
  }

  /* Utiliser requestAnimationFrame pour lisser les mises à jour */
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', update);
  update();

})();
