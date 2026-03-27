/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Arrière-plan vidéo piloté par le scroll
   · Change le src d'une <img> fixée en arrière-plan
   · Les frames défilent proportionnellement au scroll
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var TOTAL_FRAMES = 61;
  var FRAME_PATH   = 'assets/videos/frames/frame-';
  var FRAME_EXT    = '.jpg';

  var bg = document.getElementById('scroll-video-bg');
  if (!bg) return;

  /* Pré-construire tous les chemins de frames */
  var srcs = [];
  for (var i = 0; i < TOTAL_FRAMES; i++) {
    var num = String(i + 1);
    while (num.length < 4) num = '0' + num;
    srcs.push(FRAME_PATH + num + FRAME_EXT);
  }

  /* Pré-charger toutes les images en mémoire */
  var images = [];
  for (var j = 0; j < TOTAL_FRAMES; j++) {
    var img = new Image();
    img.src = srcs[j];
    images.push(img);
  }

  var currentIndex = -1;
  var rafId = null;

  function onScroll() {
    if (rafId) return;

    rafId = requestAnimationFrame(function () {
      rafId = null;

      var scrollTop   = window.scrollY || document.documentElement.scrollTop;
      var scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      var progress    = Math.max(0, Math.min(1, scrollTop / scrollTotal));
      var index       = Math.round(progress * (TOTAL_FRAMES - 1));

      if (index !== currentIndex) {
        currentIndex = index;
        bg.src = srcs[index];
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* Afficher la première frame immédiatement */
  onScroll();

})();
