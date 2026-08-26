# Plan de Développement — PDF Merger & PDF Splitter

## Contexte
Deux nouvelles applications web statiques client-side basées sur la même architecture que WaterMark :
- **100% local dans le navigateur** — aucun serveur, aucune DB
- **Privacy-first** — les documents ne quittent jamais le browser
- Même stack technique : Vite, pdf-lib, pdfjs-dist, Vitest, Playwright, i18n
- Même design system, style CSS, structure de projet
- Repos privés jusqu'à validation utilisateur

---

## Projet 1: PDF Merger

### Fonctionnalités principales

#### 1. Upload Drag & Drop
- Zone de drop unique avec drag-and-drop
- Support de 1 à 10 fichiers PDF (extension future possible)
- Ordre visuel : les fichiers sont affichés dans l'ordre d'upload
- Réorganisation possible via drag-and-drop entre miniatures
- Validation : tous les fichiers doivent être PDF

#### 2. Interface visuelle
- Miniatures des pages en prévisualisation (page 1 de chaque PDF)
- Liste numérotée des fichiers dans l'ordre
- Boutons pour supprimer un fichier de la liste
- Affichage du nombre total de pages résultantes
- Indicateur de progression pendant le traitement

#### 3. Controls
- Bouton "Merge PDFs" — fusionne tous les fichiers
- Bouton "Reset" — commence une nouvelle fusion
- Sélection de l'ordre : croissant/décroissant (optionnel)
- Option de compression (quality slider)

#### 4. Download
- Génération du PDF fusionné en local (pdf-lib)
- Téléchargement automatique du résultat
- Nom du fichier : `merged_<timestamp>.pdf`
- Possibilité de relancer une nouvelle fusion sans recharger la page

---

## Projet 2: PDF Splitter

### Fonctionnalités principales

#### 1. Upload
- Drop zone unique pour un seul PDF
- Validation stricte : PDF seulement
- Affichage du nombre total de pages
- Prévisualisation de toutes les pages (grid ou liste)

#### 2. Mode "Extraction par plages"
- Interface pour définir des blocs de pages à extraire
- Exemple : PDF de 10 pages → 3 fichiers
  - Bloc 1 : pages 1-3
  - Bloc 2 : pages 4-7
  - Bloc 3 : pages 8-10
- Ajout dynamique de blocs (+ bouton)
- Suppression de blocs (× bouton)
- Prévisualisation des pages contenues dans chaque bloc
- Validation automatique : pas de chevauchement, pages dans les bornes

#### 3. Mode "Exclusion de pages"
- Checkbox pour chaque page
- Sélectionner les pages à RETIRER du PDF original
- Le reste est conservé dans un nouveau PDF
- Toggle "Select all" / "Deselect all"
- Indication du nombre de pages finales

#### 4. Export options
- **Mode multi-fichiers** : extrait chaque bloc en PDF séparé
  - Download zip de tous les fichiers (JSZip)
  - Ou téléchargement individuel de chaque PDF
- **Mode single-fichier** : conserve uniquement les pages sélectionnées
  - Download direct du PDF réduit
- Nom des fichiers :
  - Multi : `split_part1.pdf`, `split_part2.pdf`, etc.
  - Single : `extracted_pages_<x-y>.pdf`

---

## Architecture commune

### Structure de projet (identique à WaterMark)
```
project-root/
├── index.html              # Template HTML principal
├── package.json            # Dépendances + scripts
├── vite.config.js          # Config Vite
├── biome.json             # Linter/formatter
├── src/
│   ├── main.js            # Logique principale de l'app
│   ├── i18n.js            # Système de traduction (EN/FR/DE/ES/PT/NL/IT)
│   └── [feature].js       # Modules spécifiques (pdf-merger.js / pdf-splitter.js)
├── styles/
│   └── main.css           # Design system commun
├── public/
│   ├── favicon.svg
│   ├── manifest.json      # PWA config
│   ├── icon-192.png
│   ├── icon-512.png
│   └── sw.js              # Service Worker
├── tests/
│   ├── unit/              # Tests unitaires (Vitest)
│   │   ├── i18n.test.js
│   │   └── [feature].test.js
│   └── e2e/               # Tests E2E (Playwright)
│       ├── setup/
│       ├── helpers/
│       ├── 01-upload.spec.js
│       ├── 02-ui.spec.js
│       └── a11y.spec.js
└── docs/                  # Documentation (optional)
```

### Dépendances techniques
- **pdf-lib**: Manipulation PDF (merge, split, extraction)
- **pdfjs-dist**: Rendu des PDF en canvas (prévisualisation)
- **JSZip**: Compression multi-fichiers (pour splitter)
- **Vite**: Dev server + build
- **Vitest**: Tests unitaires
- **Playwright**: Tests E2E + a11y
- **Biome**: Lint + format

### Design system
- Responsive mobile-first
- Accessibilité complète (ARIA, contrast, keyboard nav, screen readers)
- Thème sombre clair inspiré WaterMark
- Footer avec liens GitHub + Buy Me a Coffee
- Support PWA (installable)
- i18n multilingue (EN principal + FR/DE/ES/PT/NL/IT)

---

## Phase de développement — PDF Merger

### Étape 1: Configuration initiale (Jour 1)
- [x] Création du repo Git local et push GitHub privé
- [ ] Adapter `package.json` (nom, description)
- [ ] Adapter `index.html` (title, meta, UI spécifique)
- [ ] Adapter `manifest.json` (PWA, icônes)
- [ ] Copier `i18n.js` et adapter les traductions

### Étape 2: UI principale (Jour 1-2)
- [ ] Drop zone avec drag-and-drop multiple
- [ ] Grid de miniatures avec ordre visible
- [ ] Contrôles d'ordre (up/down arrows sur chaque fichier)
- [ ] Boutons Merge et Reset
- [ ] Indicateurs de chargement/traitement

### Étape 3: Logique de fusion (Jour 2-3)
- [ ] Gestion du file input (select + drag-drop)
- [ ] Validation : tous les fichiers doivent être PDF
- [ ] Prévisualisation : page 1 de chaque PDF (pdf.js)
- [ ] Drag-reorder des fichiers (sortable)
- [ ] Fonction `mergePDFs()` avec pdf-lib
- [ ] Compression optionnelle (quality param)
- [ ] Génération et download du PDF final

### Étape 4: Tests (Jour 3-4)
- [ ] Tests unitaires : logique de fusion, validation
- [ ] Tests E2E : upload, reorder, merge, download
- [ ] Tests d'accessibilité (axe-core)
- [ ] Tests edge cases : 1 fichier, 10 fichiers, gros PDF

### Étape 5: Polish & documentation (Jour 4)
- [ ] Améliorations UX/UI selon feedback
- [ ] README.md mis à jour
- [ ] Comments dans le code
- [ ] Audit sécurité rapide
- [ ] Préparation pour revue utilisateur

---

## Phase de développement — PDF Splitter

### Étape 1: Configuration initiale (Jour 5)
- [x] Création du repo Git local et push GitHub privé
- [ ] Adapter `package.json` (nom, description)
- [ ] Adapter `index.html` (UI spécifique split/extraction)
- [ ] Adapter `manifest.json` (PWA, icônes)
- [ ] Adapter `i18n.js` (nouvelles traductions)

### Étape 2: UI principale (Jour 5-6)
- [ ] Drop zone pour PDF unique
- [ ] Grid/Liste de toutes les pages (miniatures)
- [ ] Checkbox pour chaque page (mode exclusion)
- [ ] Interface pour définir des plages de pages (mode blocs)
- [ ] Boutons Add block, Remove block
- [ ] Toggle Switch : Mode Extraction vs Mode Exclusion

### Étape 3: Logique de splitting (Jour 6-7)
- [ ] Chargement du PDF + extraction de toutes les pages (pdf.js)
- [ ] Gestion des checkboxes (pages à exclure)
- [ ] Gestion des plages de pages (validation, chevauchements)
- [ ] Fonction `extractPages()` avec pdf-lib
- [ ] Mode multi-export : génération multiple + JSZip
- [ ] Mode single-export : PDF réduit
- [ ] Téléchargement (zip ou individuels)

### Étape 4: Tests (Jour 7-8)
- [ ] Tests unitaires : logique d'extraction, plages
- [ ] Tests E2E : upload, sélection, split, download
- [ ] Tests d'accessibilité (axe-core)
- [ ] Edge cases : PDF 1 page, PDF gros (>100 pages), plages invalides

### Étape 5: Polish & documentation (Jour 8)
- [ ] Améliorations UX/UI selon feedback
- [ ] README.md mis à jour
- [ ] Comments dans le code
- [ ] Audit sécurité rapide
- [ ] Préparation pour revue utilisateur

---

## Points d'attention communs

### Sécurité & Confidentialité
- Aucune donnée envoyée à un serveur
- Pas de tracking, pas d'analytics
- Code open source (quand publié)
- Audit régulier des dépendances (npm audit)

### Accessibilité (a11y)
- Navigation au clavier complète
- ARIA labels sur tous les contrôles
- Contrast ratio WCAG AA minimum
- Support des screen readers (NVDA, VoiceOver)
- Tests automatisés avec axe-core

### Performance
- Lazy loading des miniatures PDF
- Web Workers pour les opérations lourdes (si besoin)
- Limitation des fichiers : 10 max pour merger
- Limitation taille : ~50MB par fichier (RAM browser)

### Internationalisation
- English comme langue par défaut (public project)
- FR, DE, ES, PT, NL, IT disponibles
- Clés i18n centralisées dans `i18n.js`
- Pas de détection automatique de langue pour public apps

---

## Prochaines étapes immédiates

### À faire maintenant :
1. **Adapter les bases** : package.json, index.html, manifest.json, i18n.js pour les 2 projets
2. **Créer les premières branches de dev** : `dev/pdf-merger` et `dev/pdf-splitter`
3. **Valider le plan** avec l'utilisateur
4. **Commencer le développement** du PDF Merger (premier projet)

### Communication :
- Suivi par Telegram après chaque étape majeure
- Push automatique vers GitHub après chaque commit
- Revue code avant merge vers main

---

## Notes techniques spécifiques

### PDF Merger - Implémentation pdf-lib
```javascript
import { PDFDocument } from 'pdf-lib';

async function mergePDFs(files) {
  const merged = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const indices = pdf.getPageIndices();
    const copied = await merged.copyPages(pdf, indices);
    copied.forEach(page => merged.addPage(page));
  }
  
  return merged.save(); // ArrayBuffer du PDF final
}
```

### PDF Splitter - Extraction de pages
```javascript
import { PDFDocument } from 'pdf-lib';

async function extractPages(sourcePdfArrayBuffer, pageNumbers) {
  const source = await PDFDocument.load(sourcePdfArrayBuffer);
  const extracted = await PDFDocument.create();
  
  const pages = await extracted.copyPages(source, pageNumbers);
  pages.forEach(page => extracted.addPage(page));
  
  return extracted.save();
}
```

### Drag & Drop Reordering
- Utiliser la native HTML5 Drag and Drop API
- Ou librairie légère : `SortableJS` (si besoin de plus de features)
- Stocker l'ordre dans un array `fileOrder[]`
- Mettre à jour l'affichage à chaque changement

---

## Métriques de succès

### Fonctionnelles :
- Fusionner 1-10 PDF sans erreur
- Extraire des pages avec précision
- Support fichiers jusqu'à ~50MB
- Temps de traitement acceptable (<10s pour 10 PDF de 50 pages)

### Techniques :
- Score Lighthouse >90 (Performance, Accessibility, Best Practices, SEO)
- 100% tests unitaires couverts sur la logique critique
- Zéro vulnérabilité npm
- Zéro console error en production

### UX :
- Workflow complet ≤ 3 clics (upload → merge → download)
- Feedback visuel pendant le traitement
- Messages d'erreur clairs si problème
- Responsive parfait (mobile, tablette, desktop)

---

*Plan généré le 26 août 2026 — Prêt pour validation et démarrage du développement.*
