/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Arrière-plan vidéo piloté par le scroll
   · 30 frames JPEG en arrière-plan fixé
   · Frame 1 en haut de page → Frame 30 au début de Missions BIM
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var TOTAL_FRAMES = 30;
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
    /* Scroll de 0 (haut de page) jusqu'au haut de la section Missions */
    var scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
    var endPoint   = missions.offsetTop;

    if (endPoint <= 0) return;

    var progress = scrollTop / endPoint;
    progress = Math.max(0, Math.min(1, progress));

    var index = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);

    if (index !== currentIndex) {
      currentIndex = index;
      bg.src = srcs[index];
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

})();
