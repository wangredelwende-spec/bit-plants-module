# Plants Module — Database

Base de données PostgreSQL pour le module Plants (Infineon/BIT Excellence Program 2026).

## Fichiers

| Fichier | Description |
|---|---|
| `init.sql` | Script PostgreSQL exécutable — crée les tables migrées et insère les données de référence. **Source de vérité** pour les tables déjà migrées (`fermes`, `varietes`, `calendrier_croissance`). |
| `schema.sql` | Ancien schéma SQLite (7 tables). **Référence historique** — les tables non encore migrées (`inventaire_engrais`, `sante_maladies`, `recoltes`, `pepiniere`) y restent comme référence jusqu'à leur migration. |
| `plants_class_diagram.mmd` | Diagramme de classes UML (format Mermaid). |

## Prérequis

- **PostgreSQL** ≥ 16 installé et service actif
- Outil `psql` accessible (ex. `C:\Program Files\PostgreSQL\17\bin\psql.exe`)

## Créer / recréer la base

```powershell
# Créer la base (première fois)
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE plantsdb"

# Charger le schéma + données
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d plantsdb -f "init.sql"
```

Pour recréer depuis zéro :
```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "DROP DATABASE IF EXISTS plantsdb"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE plantsdb"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d plantsdb -f "init.sql"
```

## Vérifier

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d plantsdb -c "SELECT nom, bloc_parcelle FROM varietes;"
# → Keitt | A

& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d plantsdb -c "SELECT bloc_parcelle, date_plantation FROM calendrier_croissance;"
# → A | 2022-03-15
```

## Étape suivante

Une fois la base créée, lancez le backend Spring Boot (`backend-spring/README.md`).
