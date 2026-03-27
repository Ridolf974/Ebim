/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Arrière-plan vidéo piloté par le scroll
   · 61 frames JPEG en arrière-plan fixé
   · Frame 1 en haut de page → Frame 61 au début de Missions BIM
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var TOTAL_FRAMES = 121;
  var FRAME_PATH   = 'assets/videos/frames/frame-';
  var FRAME_EXT    = '.jpg';

  var bg = document.getElementById('scroll-video-bg');
  var missions = document.getElementById('missions');
  if (!bg || !missions) return;

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

  function update() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    /* Calculer dynamiquement la position de Missions BIM
       (peut changer après le chargement des polices, images, etc.) */
    var endPoint = missions.getBoundingClientRect().top + scrollTop;

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
  update();

})();
