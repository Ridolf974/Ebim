/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Arrière-plan vidéo piloté par le scroll
   · 121 frames JPEG en arrière-plan fixé
   · Frame 1 en haut de page → Frame 121 au bas visible de Modélisation
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var TOTAL_FRAMES = 121;
  var FRAME_PATH   = 'assets/videos/frames/frame-';
  var FRAME_EXT    = '.jpg';

  var bg = document.getElementById('scroll-video-bg');
  var endSection = document.getElementById('modelisation');
  if (!bg || !endSection) return;

  /* Construire les chemins et pré-charger */
  var srcs = [];
  for (var i = 0; i < TOTAL_FRAMES; i++) {
    var num = String(i + 1);
    while (num.length < 4) num = '0' + num;
    srcs.push(FRAME_PATH + num + FRAME_EXT);

    var preload = new Image();
    preload.src = srcs[i];
  }

  var currentIndex = 0;

  /* Position absolue du bas de la section cible (remonte les offsetParent) */
  function getSectionBottom() {
    var top = 0;
    var el = endSection;
    while (el) {
      top += el.offsetTop || 0;
      el = el.offsetParent;
    }
    return top + endSection.offsetHeight;
  }

  function update() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    /* endPoint = scroll où le bas de #modelisation touche le bas du viewport */
    var endPoint = getSectionBottom() - window.innerHeight;
    if (endPoint <= 0) return;

    var progress = scrollTop / endPoint;
    progress = Math.max(0, Math.min(1, progress));

    var index = Math.min(Math.round(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

    if (index !== currentIndex) {
      currentIndex = index;
      bg.src = srcs[index];
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('load', update);
  update();

})();
