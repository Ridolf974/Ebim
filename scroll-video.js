/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Arrière-plan vidéo piloté par le scroll
   · 6 frames JPEG en arrière-plan fixé
   · Change de frame proportionnellement au scroll de la page
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var TOTAL_FRAMES = 6;
  var FRAME_PATH   = 'assets/videos/frames/frame-';
  var FRAME_EXT    = '.jpg';

  var bg = document.getElementById('scroll-video-bg');
  if (!bg) return;

  /* Construire les chemins et pré-charger */
  var srcs = [];
  for (var i = 0; i < TOTAL_FRAMES; i++) {
    var num = String(i + 1);
    while (num.length < 4) num = '0' + num;
    srcs.push(FRAME_PATH + num + FRAME_EXT);

    /* Pré-charger l'image en mémoire */
    var preload = new Image();
    preload.src = srcs[i];
  }

  var currentIndex = 0;

  function update() {
    var scrollTop   = window.pageYOffset || document.documentElement.scrollTop;
    var scrollTotal = document.documentElement.scrollHeight - window.innerHeight;

    /* Éviter division par zéro */
    if (scrollTotal <= 0) return;

    var progress = scrollTop / scrollTotal;
    progress = Math.max(0, Math.min(1, progress));

    var index = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);

    if (index !== currentIndex) {
      currentIndex = index;
      bg.src = srcs[index];
    }
  }

  /* Écouter le scroll */
  window.addEventListener('scroll', update, { passive: true });

  /* Premier rendu */
  update();

})();
