/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Arrière-plan vidéo piloté par le scroll
   · Chargement des frames pré-extraites (images JPEG)
   · Canvas fixé en arrière-plan, couvre tout le viewport
   · Les frames défilent proportionnellement au scroll de la page
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Configuration ──────────────────────────────────── */
  var TOTAL_FRAMES = 61;
  var FRAME_PATH   = 'assets/videos/frames/frame-';
  var FRAME_EXT    = '.jpg';

  /* ── Références DOM ─────────────────────────────────── */
  var canvas = document.getElementById('scroll-video-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');

  /* ── État interne ───────────────────────────────────── */
  var frames       = [];
  var loadedCount  = 0;
  var isReady      = false;
  var currentFrame = -1;
  var rafId        = null;

  /* ── Génération du chemin d'une frame ───────────────── */
  function frameSrc(index) {
    var num = String(index + 1);
    while (num.length < 4) num = '0' + num;
    return FRAME_PATH + num + FRAME_EXT;
  }

  /* ── Redimensionner le canvas pour couvrir le viewport ─ */
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    /* Redessiner la frame courante après le resize */
    if (currentFrame >= 0 && frames[currentFrame] && frames[currentFrame].complete) {
      drawCover(frames[currentFrame]);
    }
  }

  /* ── Dessiner une image en mode "cover" sur le canvas ── */
  function drawCover(img) {
    var cw = canvas.width;
    var ch = canvas.height;
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;

    /* Calculer les dimensions pour couvrir tout le canvas (comme background-size: cover) */
    var scale = Math.max(cw / iw, ch / ih);
    var dw = iw * scale;
    var dh = ih * scale;
    var dx = (cw - dw) / 2;
    var dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  /* ── Rendu d'une frame ──────────────────────────────── */
  function renderFrame(index) {
    index = Math.max(0, Math.min(index, frames.length - 1));
    if (index === currentFrame) return;
    if (!frames[index] || !frames[index].complete) return;

    currentFrame = index;
    drawCover(frames[index]);
  }

  /* ── Gestion du scroll ──────────────────────────────── */
  function onScroll() {
    if (!isReady) return;
    if (rafId) return;

    rafId = requestAnimationFrame(function () {
      rafId = null;

      /* Progression du scroll sur toute la page : 0 en haut, 1 en bas */
      var scrollTop   = window.scrollY || document.documentElement.scrollTop;
      var scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      var progress    = Math.max(0, Math.min(1, scrollTop / scrollTotal));

      var frameIndex = Math.round(progress * (frames.length - 1));
      renderFrame(frameIndex);
    });
  }

  /* ── Chargement de toutes les frames ────────────────── */
  function loadFrames() {
    for (var i = 0; i < TOTAL_FRAMES; i++) {
      var img = new Image();
      img.src = frameSrc(i);

      img.onload = function () {
        loadedCount++;

        /* Afficher la première frame dès qu'elle est prête */
        if (loadedCount === 1) {
          resizeCanvas();
          renderFrame(0);
        }

        /* Toutes les frames chargées */
        if (loadedCount === TOTAL_FRAMES) {
          isReady = true;
          onScroll();
        }
      };

      img.onerror = function () {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          isReady = true;
        }
      };

      frames.push(img);
    }
  }

  /* ── Écouteurs ──────────────────────────────────────── */
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resizeCanvas);

  /* ── Lancement ──────────────────────────────────────── */
  resizeCanvas();
  loadFrames();

})();
