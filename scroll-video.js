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
  var endPoint = 0;

  /* Calculer le point final après chargement complet de la page
     (polices, images, etc. peuvent décaler la mise en page) */
  function calcEndPoint() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var rect = missions.getBoundingClientRect();
    /* Position absolue du bas de #missions moins la hauteur du viewport */
    endPoint = rect.bottom + scrollTop - window.innerHeight;
  }

  window.addEventListener('load', calcEndPoint);
  /* Recalculer aussi au redimensionnement */
  window.addEventListener('resize', calcEndPoint);

  function update() {
    if (endPoint <= 0) return;

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    var progress = scrollTop / endPoint;
    progress = Math.max(0, Math.min(1, progress));

    var index = Math.min(Math.round(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

    if (index !== currentIndex) {
      currentIndex = index;
      bg.src = srcs[index];
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  calcEndPoint();
  update();

})();
