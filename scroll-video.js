/* ══════════════════════════════════════════════════════════
   eBIM Ingénierie — Animation vidéo pilotée par le scroll
   · Extraction des frames d'une vidéo dans un tableau
   · Rendu image par image sur un <canvas> visible
   · Synchronisation linéaire avec la position de scroll
   · Optimisation via IntersectionObserver + requestAnimationFrame
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Configuration ──────────────────────────────────── */
  var CONFIG = {
    videoSrc: 'assets/videos/scroll-video.mp4',
    /* Nombre de frames à extraire — réduit sur mobile pour économiser la mémoire */
    totalFrames: window.innerWidth < 768 ? 80 : 150,
    canvasId: 'scroll-video-canvas',
    sectionId: 'scroll-video',
    loaderId: 'scroll-video-loader',
  };

  /* ── Références DOM ─────────────────────────────────── */
  var canvas  = document.getElementById(CONFIG.canvasId);
  var section = document.getElementById(CONFIG.sectionId);
  var loader  = document.getElementById(CONFIG.loaderId);

  /* Ne rien faire si la section n'existe pas dans le DOM */
  if (!canvas || !section) return;

  var ctx = canvas.getContext('2d');

  /* ── État interne ───────────────────────────────────── */
  var state = {
    frames: [],          // Tableau de ImageBitmap ou HTMLCanvasElement
    isLoaded: false,     // Frames extraites ?
    isVisible: false,    // Section visible dans le viewport ?
    currentFrame: -1,    // Dernière frame affichée (éviter les rendus redondants)
    rafId: null,         // ID du requestAnimationFrame en cours
  };

  /* ── Extraction des frames ──────────────────────────── */
  /* Crée un élément <video> hors-écran, parcourt la vidéo
     par seek séquentiel et capture chaque frame. */
  async function extractFrames() {
    var video = document.createElement('video');
    video.src = CONFIG.videoSrc;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    /* Nécessaire pour le seek sur certains navigateurs */
    video.crossOrigin = 'anonymous';

    /* Attendre le chargement des métadonnées (durée, dimensions) */
    await new Promise(function (resolve, reject) {
      video.addEventListener('loadedmetadata', resolve, { once: true });
      video.addEventListener('error', function () {
        reject(new Error('Impossible de charger la vidéo : ' + CONFIG.videoSrc));
      }, { once: true });
    });

    /* Dimensionner le canvas selon la résolution native de la vidéo */
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;

    var interval = video.duration / (CONFIG.totalFrames - 1);

    /* Boucle séquentielle : seek → capture → stockage */
    for (var i = 0; i < CONFIG.totalFrames; i++) {
      video.currentTime = i * interval;

      /* Attendre que le seek soit terminé */
      await new Promise(function (r) {
        video.addEventListener('seeked', r, { once: true });
      });

      /* Dessiner la frame courante sur un canvas hors-écran */
      var offscreen    = document.createElement('canvas');
      offscreen.width  = video.videoWidth;
      offscreen.height = video.videoHeight;
      var offCtx = offscreen.getContext('2d');
      offCtx.drawImage(video, 0, 0);

      /* Stocker comme ImageBitmap si disponible (plus performant),
         sinon conserver le canvas hors-écran directement */
      if (typeof createImageBitmap === 'function') {
        state.frames.push(await createImageBitmap(offscreen));
      } else {
        state.frames.push(offscreen);
      }
    }

    /* Chargement terminé */
    state.isLoaded = true;

    /* Masquer l'indicateur de chargement */
    if (loader) {
      loader.style.display = 'none';
    }

    /* Afficher la première frame */
    renderFrame(0);
  }

  /* ── Rendu d'une frame sur le canvas visible ────────── */
  function renderFrame(index) {
    /* Borner l'index dans les limites du tableau */
    index = Math.max(0, Math.min(index, state.frames.length - 1));

    /* Éviter de redessiner la même frame */
    if (index === state.currentFrame) return;
    state.currentFrame = index;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(state.frames[index], 0, 0, canvas.width, canvas.height);
  }

  /* ── Gestion du scroll ──────────────────────────────── */
  /* Calcule la progression du scroll dans la section
     et détermine la frame correspondante. */
  function onScroll() {
    if (!state.isLoaded || !state.isVisible) return;

    /* Éviter les appels multiples par frame d'animation */
    if (state.rafId) return;

    state.rafId = requestAnimationFrame(function () {
      state.rafId = null;

      var rect = section.getBoundingClientRect();
      /* Hauteur de scroll exploitable : hauteur totale - viewport */
      var sectionHeight = section.offsetHeight - window.innerHeight;

      /* Progression : 0 quand le haut de la section atteint le haut du viewport,
                       1 quand le bas de la section atteint le bas du viewport */
      var scrolled = -rect.top;
      var progress = Math.max(0, Math.min(1, scrolled / sectionHeight));

      var frameIndex = Math.round(progress * (state.frames.length - 1));
      renderFrame(frameIndex);
    });
  }

  /* ── IntersectionObserver pour la performance ────────── */
  /* N'écouter le scroll que lorsque la section est visible
     (ou sur le point de l'être grâce au rootMargin). */
  var visibilityObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      state.isVisible = entry.isIntersecting;

      if (entry.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Rendu immédiat
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    });
  }, { threshold: 0, rootMargin: '100px 0px' });

  visibilityObs.observe(section);

  /* ── Lancement de l'extraction ──────────────────────── */
  extractFrames().catch(function (err) {
    console.warn('[scroll-video] Erreur lors du chargement :', err);
    /* En cas d'erreur, masquer le loader pour ne pas bloquer visuellement */
    if (loader) {
      loader.style.display = 'none';
    }
  });

})();
