# Plants Module — Frontend (React)

**Stack** : React 19 + Vite

## Prérequis

- **Node.js** ≥ 18 (testé avec v22.20)
- **Backend Spring Boot** en cours d'exécution sur `http://localhost:8080` (voir `backend-spring/README.md`)

## Installation et lancement

```bash
npm install
npm run dev
```

Le serveur de développement démarre sur **http://localhost:5173**.

## Configuration

L'URL du backend est définie dans `src/api/varieties.js` :
```js
const API_BASE = 'http://localhost:8080';
```
À adapter si le backend tourne sur un autre port.

## Fonctionnalités (Task 1 — Variétés)

- **Tableau** listant toutes les variétés de mangue
- **Filtre** par bloc/parcelle (dropdown) — envoie la valeur brute (`?bloc_parcelle=A`) à l'API
- **Affichage** : `bloc_parcelle='A'` → affiché "Block A" (préfixe display-only)
- **Champs NULL** (`vigueur`, `origine_plant`, `densite_arbres_ha`, `rendement_reel_kg`) → affiché "—"
- **Modale détail** au clic sur une ligne du tableau
- **État d'erreur** : bannière avec bouton "Retry" si le backend est injoignable

## Structure des composants

```
src/
├── api/varieties.js          — Client API (fetch vers Spring Boot)
├── App.jsx                   — Composant racine, gestion d'état
├── index.css                 — Tokens CSS (repris du frontend vanilla)
├── main.jsx                  — Point d'entrée Vite/React
└── components/
    ├── AppHeader.jsx          — En-tête avec logo et nom de la ferme
    ├── AppNav.jsx             — Barre de navigation latérale
    ├── FilterBar.jsx          — Dropdown filtre bloc_parcelle
    ├── VarietiesTable.jsx     — Tableau des variétés
    ├── VarietyModal.jsx       — Modale de détail
    ├── StateMessages.jsx      — Loading / Error+Retry / Empty
    └── formatters.jsx         — Utilitaires d'affichage (null → —, Block prefix, etc.)
```
