---
name: scroll-video-animation
description: Animation d'arrière-plan vidéo pilotée par le scroll. Pré-extrait les frames d'une vidéo et les affiche en fond fixe, la frame change au fur et à mesure que l'utilisateur scrolle. Utiliser ce skill quand on veut un effet « vidéo qui avance au scroll » sur une page web.
---

Ce skill implémente une animation d'arrière-plan vidéo contrôlée par le défilement de la page. Une vidéo est décomposée en frames JPEG qui s'affichent séquentiellement en fond fixe selon la position de scroll.

L'utilisateur fournit : une vidéo source (.mp4), une section HTML cible (la section où la dernière frame doit apparaître), et éventuellement des contraintes de performance.

## Étape 1 — Extraction des frames

Extraire TOUTES les frames de la vidéo au fps natif, en qualité maximale :

```bash
# Vérifier les propriétés de la vidéo
ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,r_frame_rate,duration -of csv=p=0 video.mp4

# Extraire toutes les frames (qualité max, fps natif)
ffmpeg -i video.mp4 -qscale:v 2 assets/videos/frames/frame-%04d.jpg
```

**Règles :**
- Toujours utiliser `-qscale:v 2` pour la meilleure qualité JPEG possible
- Ne JAMAIS réduire le nombre de frames (ne pas utiliser `-vf fps=X`). Le nombre total = durée × fps natif de la vidéo
- Nommage : `frame-0001.jpg`, `frame-0002.jpg`, etc. (zéro-padded sur 4 chiffres)
- Vérifier le nombre de frames extraites avec `ls frames/ | wc -l`

## Étape 2 — HTML

Placer un `<img>` juste après `<body>`, avant tout le contenu de la page :

```html
<body>
  <img class="scroll-video-bg" id="scroll-video-bg"
       src="assets/videos/frames/frame-0001.jpg" alt="" />

  <!-- Navigation, main, footer... -->
</body>
```

Le script se charge dans un `<script src="scroll-video.js"></script>` avant le script principal.

## Étape 3 — CSS

Uniquement le positionnement de l'image de fond :

```css
.scroll-video-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  object-fit: cover;
  pointer-events: none;
}
```

Le contenu au-dessus doit avoir `position: relative; z-index: 1;` (sur `<main>`, `<footer>`, etc.).

Les choix de design des sections (fonds transparents, opaques, couleurs) sont décidés au cas par cas selon le projet — ce skill ne les impose pas.

## Étape 4 — JavaScript (technique validée)

```js
(function () {
  'use strict';

  /* Forcer le retour en haut au refresh */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  var TOTAL_FRAMES = __NOMBRE__;          // ← adapter au nombre réel de frames
  var FRAME_PATH   = 'assets/videos/frames/frame-';
  var FRAME_EXT    = '.jpg';

  var bg       = document.getElementById('scroll-video-bg');
  var endpoint = document.getElementById('__SECTION_ID__');  // ← section cible
  if (!bg || !endpoint) return;

  /* Construire les chemins et pré-charger toutes les frames */
  var srcs = [];
  for (var i = 0; i < TOTAL_FRAMES; i++) {
    var num = String(i + 1);
    while (num.length < 4) num = '0' + num;
    srcs.push(FRAME_PATH + num + FRAME_EXT);
    var preload = new Image();
    preload.src = srcs[i];
  }

  var currentIndex = 0;

  /* Position absolue du bas d'un élément
     (remonte la chaîne offsetParent pour éviter les erreurs
      quand un parent a position: relative) */
  function getAbsoluteBottom(el) {
    var top = 0;
    var current = el;
    while (current) {
      top += current.offsetTop || 0;
      current = current.offsetParent;
    }
    return top + el.offsetHeight;
  }

  function update() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    /* endPoint = scroll où le bas de la section cible touche le bas du viewport */
    var endPoint = getAbsoluteBottom(endpoint) - window.innerHeight;
    if (endPoint <= 0) return;

    var progress = scrollTop / endPoint;
    progress = Math.max(0, Math.min(1, progress));

    var index = Math.min(
      Math.round(progress * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    );

    if (index !== currentIndex) {
      currentIndex = index;
      bg.src = srcs[index];
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('load', update);
  update();
})();
```

**Points critiques :**
- `getAbsoluteBottom()` remonte toute la chaîne `offsetParent` → position absolue correcte même si `<main>` ou un autre parent a `position: relative`
- `endPoint` recalculé à chaque scroll (pas de cache) → s'adapte aux changements de layout (polices, images, resize)
- `scrollRestoration = 'manual'` → empêche le navigateur de restaurer une position de scroll au refresh
- Pré-chargement via `new Image()` → évite le clignotement blanc entre les frames

## Pièges à éviter

| Erreur | Pourquoi ça échoue | Solution |
|--------|-------------------|----------|
| `<canvas>` + `drawImage()` | Instable, ne rend pas toujours | Utiliser un simple `<img>` avec changement de `src` |
| `<video>` + `currentTime` côté navigateur | Trop lent, seek asynchrone, buggé | Pré-extraire les frames en JPEG |
| `el.offsetTop` sans remonter `offsetParent` | Valeur relative au parent positionné, pas au document | Boucle `while (el.offsetParent)` |
| Cacher le endpoint au `load` | Peut être faux si le layout change après (polices, images) | Recalculer dynamiquement à chaque scroll |
| Réduire le nombre de frames (`-vf fps=12`) | Animation saccadée, perte de la fin de la vidéo | Garder TOUTES les frames natives |
| `endPoint = bottom` sans `- window.innerHeight` | Dernière frame visible seulement après avoir scrollé AU-DELÀ de la section | Soustraire `window.innerHeight` |
| `endPoint = top` de la section | Dernière frame trop tôt (haut de la section au lieu du bas) | Utiliser `top + offsetHeight` (= bottom) |
