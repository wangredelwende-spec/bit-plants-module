-- ============================================================
-- Module Plants (manguiers) — Infineon/BIT Excellence Program 2026
-- Base de données : PostgreSQL (migration depuis SQLite schema.sql)
-- Auteure : Delwende Esther Wangré
-- Périmètre : Task 1 (fermes + varietes) + Task 2 (calendrier_croissance)
-- Les autres tables (inventaire_engrais, sante_maladies, recoltes, pepiniere)
-- seront ajoutées par les tâches correspondantes.
-- ============================================================

-- Connexion à la base cible attendue : plantsdb

-- Table racine : anticipation multi-site (une ferme = une ligne, jamais codé en dur)
CREATE TABLE IF NOT EXISTS fermes (
    id_ferme  SERIAL PRIMARY KEY,
    nom       VARCHAR(255) NOT NULL,   -- ex. "Banfora"
    region    VARCHAR(255),
    pluviometrie_mm_an REAL,
    type_sol  VARCHAR(255),
    date_creation TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tâche 1 : Sélection et suivi des variétés
CREATE TABLE IF NOT EXISTS varietes (
    id                       SERIAL PRIMARY KEY,
    id_ferme                 INTEGER REFERENCES fermes(id_ferme),
    nom                      VARCHAR(255) NOT NULL,
    nombre_arbres            INTEGER,
    espacement_inter_rang_m  REAL,
    espacement_intra_rang_m  REAL,
    densite_arbres_ha        REAL,           -- NULL volontaire : donnée non disponible
    rendement_attendu_kg     REAL,
    rendement_reel_kg        REAL,           -- NULL volontaire : donnée non disponible (v2, section 12)
    vigueur                  VARCHAR(50),    -- NULL volontaire : donnée non disponible
    bloc_parcelle            VARCHAR(50),    -- clé de liaison transversale (unique par ferme)
    origine_plant            VARCHAR(255),   -- NULL volontaire : lien table pépinière
    source                   VARCHAR(255),   -- ex. "Zalka_2025", "manuel"
    date_maj                 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Données de référence (Zalka 2025, cf. section 17.1/17.2 du contexte)
-- Kent et Amélie étaient des scénarios hypothétiques retirés le 06/08.
-- Keitt est la seule variété réellement plantée.
-- Les champs NULL ci-dessous sont intentionnels — ne pas inventer de valeurs.
-- ============================================================

INSERT INTO fermes (nom, region, pluviometrie_mm_an, type_sol)
VALUES ('Banfora', 'Cascades', 1100, 'fertile');

INSERT INTO varietes (id_ferme, nom, nombre_arbres, espacement_inter_rang_m, espacement_intra_rang_m, rendement_attendu_kg, bloc_parcelle, source)
VALUES (1, 'Keitt', 200, 8, 8, 44000, 'A', 'Zalka_2025');
-- Note : vigueur, origine_plant, densite_arbres_ha, rendement_reel_kg restent NULL —
-- ces données ne sont pas disponibles dans le chiffrage source (Zalka 2025).

-- ============================================================
-- Tâche 2 : Calendrier de plantation & stades de croissance
-- age_arbre : NON stocké en base — calculé côté backend depuis
--   date_plantation à chaque requête (Reliability, section 14).
-- stade_actuel et phase_annees : valeurs provisoires, les seuils
--   et la terminologie sont des décisions agronomiques à valider.
-- precision_date : présent dans le doc de contexte (section 1.7)
--   mais absent de schema.sql — divergence connue, inclus ici.
-- ============================================================

CREATE TABLE IF NOT EXISTS calendrier_croissance (
    id                     SERIAL PRIMARY KEY,
    id_ferme               INTEGER REFERENCES fermes(id_ferme),
    bloc_parcelle          VARCHAR(50) NOT NULL,
    date_plantation        DATE,                -- saisie manuelle, par bloc
    precision_date         VARCHAR(50),          -- cf. doc contexte section 1.7
    stade_actuel           VARCHAR(50),          -- provisoire: pepiniere / croissance / production
    phase_annees           VARCHAR(20),          -- provisoire: 0-2 / 3-5 / 5-7 (calendrier Zalka)
    pluviometrie_locale_mm REAL,                 -- optionnelle, source externe
    -- age_arbre : NON stocké, calculé depuis date_plantation (Reliability)
    source                 VARCHAR(255),
    date_maj               TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO calendrier_croissance (id_ferme, bloc_parcelle, date_plantation, stade_actuel, phase_annees, source)
VALUES (1, 'A', '2022-03-15', 'production', '3-5', 'valeur provisoire à valider');
-- Note : date_plantation provisoire (dérivée du mockup, pas du chiffrage Zalka).
-- pluviometrie_locale_mm = NULL : source externe pas encore intégrée.
-- precision_date = NULL : pas de donnée disponible.
