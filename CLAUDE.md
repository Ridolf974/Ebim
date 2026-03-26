# Projet EBIM — Site vitrine BIM Management

## Contexte
eBIM Ingénierie est un bureau d'études réunionnais spécialisé en BIM Management.
Implanté à La Réunion, il intervient dans l'Océan Indien (Réunion, Mayotte, Mozambique, Afrique du Sud)
et en France métropolitaine.
Dirigé par Arnaud PLASSARD, ingénieur diplômé du mastère spécialisé BIM (ESTP / ENPC – Promo 2016).

## Stack technique
- HTML5, CSS3, JavaScript vanilla uniquement
- Aucun framework, aucune dépendance npm
- Fichiers : `index.html`, `style.css`, `script.js`
- Logo récupéré depuis : https://ebim-ing.re/images/ebim-logo.svg

## Structure des fichiers
```
/
├── index.html
├── style.css
├── script.js
└── assets/
    └── images/
```

## Navigation du site
1. Accueil
2. Missions BIM
3. Modélisation de l'existant
4. Formations BIM
5. Contact

---

## Contenu — Section Accueil (Hero)
**Accroche principale :**
> BIM – Modélisation de l'existant – Commissionnement – Formation

**Présentation :**
Bureau d'études réunionnais spécialisé dans le « Building Information Modeling » (BIM),
eBIM Ingénierie assure plusieurs types de missions autour du Management BIM :
- Accompagnement à maîtrise d'ouvrage (AMO BIM)
- Gestion de projet de construction (BIM Management, Modélisation de l'existant, création de DOE numérique, synthèse numérique)
- Ingénierie de maintenance (DIUEM, Commissionnement)
- Formations BIM multi-niveaux

---

## Contenu — Section Services (Missions BIM)

### AMO BIM
Accompagnement et encadrement des projets BIM pour la maîtrise d'ouvrage, de la phase de programmation jusqu'à l'exploitation de la maquette numérique.
- Définition des objectifs et de la stratégie BIM
- Rédaction des documents de référence (Cahier des charges BIM, Charte BIM)
- Accompagnement dans la sélection des maîtrises d'œuvre et entreprises
- Contrôle de la maquette numérique durant les phases clés
- Accompagnement dans la mise en exploitation des maquettes numériques

### BIM Management
Organisation des méthodes et processus pour l'établissement et le suivi de la maquette numérique.
- Rédaction et mise en place de la Convention BIM
- Gestion de la plateforme collaborative
- Coordination et suivi des maquettes de maîtrise d'œuvre et d'exécution
- Garant de la cohérence et de l'interopérabilité des maquettes numériques

### Synthèse numérique
Coordination des lots techniques et architecturaux sur la base de maquettes numériques, pour détecter les conflits/clashs entre lots.
- Mise en place d'une plateforme d'échange de données BIM
- Vérification des maquettes numériques
- Détection des collisions et édition des rapports

### Modélisation de l'existant
Remise en maquette d'ouvrage existant (à partir de plans ou nuage de points).
- Réhabilitation / Rénovation
- Mise en exploitation (maquette telle que construite)
- Communication (visite virtuelle)
- Gestion et planification de chantier

### Commissionnement
Processus de contrôle qualité structuré sur toutes les phases du projet, de la programmation à la livraison, pour garantir les performances énergétiques visées.

### Formations BIM
Formations logiciels et processus BIM adaptées à tous les professionnels du bâtiment.
Organisme certifié Qualiopi. Déclaration d'activité n° 04 97 31 52 497.

**Chiffres clés formations :**
- 94% des objectifs fixés atteints en fin de formation
- 97% des apprenants satisfaits
- 97% du programme adapté aux besoins des formés

**Formations disponibles :**
- REVIT Initiation (35h)
- REVIT Perfectionnement MEP / Fluides (21h)
- REVIT – Travaux Collaboratifs BIM (14h)
- ArchiCAD Initiation (35h)
- Manipulation d'Outils BIM (7h)
- Gestion de projet BIM (14h)
- Le BIM pour la Maîtrise d'Ouvrage (14h)

---

## Contenu — Références (Modélisation)
- **Opération "Victoria"** — 220 logements + 20 commerces, Saint-André. MO : SHLMR / Action Logement
- **Opération "Danone" Le Port** — Usine de production. MO : Danone / Groupe GBH
- **Opération "Carrefour Ste Clotilde"** — Centre commercial. MO : FICASA / Groupe GBH
- **Opération "CHU – Bloc opératoire"** — Bâtiment hospitalier, Saint-Denis. MO : CHU Félix Guyon

---

## Contenu — Partenaires
- **Arcad Ingénierie** — acquisition et traitement de données 3D / scanner 3D
- **Vibrason Production** — visite virtuelle et communication

---

## Style visuel
- Moderne et dynamique
- Palette sombre avec couleur d'accent (bleu tech)
- Typographie claire, espacements généreux
- Animations au scroll
- Responsive mobile en priorité

## Règles de travail
- Commits en français, clairs et descriptifs
- Toujours créer une Pull Request, jamais committer directement sur `main`
- Code commenté en français
- Ne jamais copier le style du site actuel (ebim-ing.re) — contenu uniquement
- Suivre les directives de design définies dans `.claude/SKILL.md` pour tous les fichiers CSS et visuels
- Utiliser le skill UI/UX Pro Max pour les décisions de design : `python3 .claude/ui-ux-pro-max/scripts/search.py "<query>" --domain <style|typography|color|ux>`
