/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Animation vidéo pilotée par le scroll
   · Chargement des frames pré-extraites (images JPEG)
   · Rendu image par image sur un <canvas> visible
   · Synchronisation linéaire avec la position de scroll
   · Optimisation via IntersectionObserver + requestAnimationFrame
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Configuration ──────────────────────────────────── */
  var TOTAL_FRAMES = 61;
  var FRAME_PATH   = 'assets/videos/frames/frame-';
  var FRAME_EXT    = '.jpg';

  /* ── Références DOM ─────────────────────────────────── */
  var canvas  = document.getElementById('scroll-video-canvas');
  var section = document.getElementById('scroll-video');
  var loader  = document.getElementById('scroll-video-loader');

  /* Ne rien faire si la section n'existe pas dans le DOM */
  if (!canvas || !section) return;

  var ctx = canvas.getContext('2d');

  /* ── État interne ───────────────────────────────────── */
  var frames       = [];       // Tableau d'objets Image chargés
  var loadedCount  = 0;        // Nombre de frames chargées
  var isReady      = false;    // Toutes les frames sont chargées ?
  var isVisible    = false;    // Section visible dans le viewport ?
  var currentFrame = -1;       // Dernière frame affichée
  var rafId        = null;     // ID du requestAnimationFrame en cours

  /* ── Génération du chemin d'une frame ───────────────── */
  /* Les fichiers sont nommés frame-0001.jpg, frame-0002.jpg, etc. */
  function frameSrc(index) {
    var num = String(index + 1);
    while (num.length < 4) num = '0' + num;
    return FRAME_PATH + num + FRAME_EXT;
  }

  /* ── Chargement de toutes les frames ────────────────── */
  function loadFrames() {
    for (var i = 0; i < TOTAL_FRAMES; i++) {
      var img = new Image();
      img.src = frameSrc(i);

      /* Callback au chargement de chaque image */
      img.onload = function () {
        loadedCount++;

        /* Dimensionner le canvas avec la première image chargée */
        if (loadedCount === 1) {
          canvas.width  = frames[0].naturalWidth;
          canvas.height = frames[0].naturalHeight;
          renderFrame(0);
        }

        /* Toutes les frames sont prêtes */
        if (loadedCount === TOTAL_FRAMES) {
          isReady = true;
          if (loader) loader.style.display = 'none';
          onScroll();
        }
      };

      img.onerror = function () {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          isReady = true;
          if (loader) loader.style.display = 'none';
        }
      };

      frames.push(img);
    }
  }

  /* ── Rendu d'une frame sur le canvas visible ────────── */
  function renderFrame(index) {
    /* Borner l'index dans les limites du tableau */
    index = Math.max(0, Math.min(index, frames.length - 1));

    /* Éviter de redessiner la même frame */
    if (index === currentFrame) return;

    /* Vérifier que l'image est bien chargée */
    if (!frames[index] || !frames[index].complete) return;

    currentFrame = index;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
  }

  /* ── Gestion du scroll ──────────────────────────────── */
  function onScroll() {
    if (!isReady || !isVisible) return;

    /* Éviter les appels multiples par frame d'animation */
    if (rafId) return;

    rafId = requestAnimationFrame(function () {
      rafId = null;

      var rect = section.getBoundingClientRect();
      /* Hauteur de scroll exploitable : hauteur totale - viewport */
      var sectionHeight = section.offsetHeight - window.innerHeight;

      /* Progression : 0 quand le haut de la section atteint le haut du viewport,
                       1 quand le bas de la section atteint le bas du viewport */
      var scrolled = -rect.top;
      var progress = Math.max(0, Math.min(1, scrolled / sectionHeight));

      var frameIndex = Math.round(progress * (frames.length - 1));
      renderFrame(frameIndex);
    });
  }

  /* ── IntersectionObserver pour la performance ────────── */
  var visibilityObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      isVisible = entry.isIntersecting;

      if (entry.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    });
  }, { threshold: 0, rootMargin: '100px 0px' });

  visibilityObs.observe(section);

  /* ── Lancement du chargement ────────────────────────── */
  loadFrames();

})();
