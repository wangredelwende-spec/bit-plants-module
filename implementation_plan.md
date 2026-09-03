# Plan d'implémentation : Réalignement du Frontend (Task 1 & 2)

Ce plan vise à réaligner l'interface utilisateur React avec le mockup statique `plants_farm_dashboard.html`, sans altérer le backend ou la base de données.

## User Review Required
> [!IMPORTANT]
> L'installation de la librairie **`recharts`** est requise pour implémenter les graphiques de la Task 1 avec le rendu visuel attendu.
> Le backend ne sera pas modifié. L'enrichissement des données pour la Task 2 se fera par un appel API additionnel côté frontend (`fetchVarieties`).

## Proposed Changes

### Dependencies
- Exécuter `npm install recharts` dans le dossier `frontend-react`.

---

### Task 1 (Varieties)

#### [MODIFY] `frontend-react/src/App.jsx`
- Changer le titre de la page de `"Variety Management"` à `"Varieties"`.
- Importer et insérer les nouveaux composants de graphiques (`YieldOverviewCharts` et `YieldComparisonBars`) dans le rendu de `VarietiesScreen`, juste sous la table.

#### [MODIFY] `frontend-react/src/components/VarietiesTable.jsx`
- **Retirer** les colonnes `Density`, `Origin`, `Source`, et `Last Updated` de l'en-tête et des lignes.
- S'assurer que l'ordre correspond au mockup : `Name (Variety) | Block | Trees | Spacing | Exp. Yield | Act. Yield | Vigor`.

#### [NEW] `frontend-react/src/components/YieldOverviewCharts.jsx`
- Créer un composant qui rend la section `"Yield Overview by Block"`.
- Utiliser `recharts` pour générer le graphique en barres (`BarChart`) comparant le rendement attendu (orange) et actuel (primaire), avec la prise en charge de l'état "en attente de récolte".
- Ajouter le donut chart calculant le pourcentage global d'atteinte du rendement.

#### [NEW] `frontend-react/src/components/YieldComparisonBars.jsx`
- Créer un composant pour la section `"Expected vs Actual Yield Comparison"`.
- Générer des barres de progression en CSS standard (réutilisant les tokens existants) affichant le pourcentage d'atteinte par bloc.

---

### Task 2 (Growth Calendar)

#### [MODIFY] `frontend-react/src/components/GrowthCalendarScreen.jsx`
- **Logique** : Dans la fonction `loadData`, importer et appeler `fetchVarieties()` en parallèle ou juste après `fetchGrowthCalendar()`. Croiser les données via le `bloc_parcelle` pour attacher le nom de la variété à chaque entrée du calendrier.
- **Tableau** : 
  - **Ajouter** la colonne `Variety` juste après `Block`.
  - **Retirer** la colonne `Precision`.
- **Note sur la frise chronologique** : La section `"Growth Phases"` sera **conservée intacte**. C'est un écart identifié par rapport à la maquette initiale, mais selon la directive, nous documenterons simplement sa présence sans la supprimer.

## Verification Plan

### Manual Verification
- Démarrer l'application frontend avec `npm run dev` et le backend avec `mvnw spring-boot:run` (si pas déjà fait).
- Naviguer sur l'onglet **Varieties** : vérifier la présence des nouveaux graphiques, tester le filtrage par bloc (les graphiques doivent se mettre à jour), vérifier l'ordre des 7 colonnes, et s'assurer que les modales affichent toujours les champs masqués.
- Naviguer sur l'onglet **Growth Calendar** : vérifier la présence de la colonne Variety, l'absence de Precision, et s'assurer que la timeline est toujours là. Tester également le mode erreur (API coupée) pour confirmer que l'UI de secours avec bouton Retry s'affiche bien.
