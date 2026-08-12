-- ============================================================
-- Module Plants (manguiers) — Infineon/BIT Excellence Program 2026
-- Base de données : SQLite (migrable vers PostgreSQL, cf. section 6)
-- Auteure : Delwende Esther Wangré
-- Source de conception : trace de schéma v4 (contexte projet, section 6)
-- ============================================================

-- Table racine : anticipation multi-site (une ferme = une ligne, jamais codé en dur)
CREATE TABLE fermes (
    id_ferme INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,               -- ex. "Banfora"
    region TEXT,
    pluviometrie_mm_an REAL,
    type_sol TEXT,
    date_creation TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tâche 1 : Sélection et suivi des variétés
CREATE TABLE varietes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_ferme INTEGER REFERENCES fermes(id_ferme),
    nom TEXT NOT NULL,
    nombre_arbres INTEGER,
    espacement_inter_rang_m REAL,
    espacement_intra_rang_m REAL,
    densite_arbres_ha REAL,
    rendement_attendu_kg REAL,
    rendement_reel_kg REAL,           -- [v2] distinct du rendement attendu (section 12)
    vigueur TEXT,
    bloc_parcelle TEXT,               -- clé de liaison transversale (unique par ferme, jamais seule)
    origine_plant TEXT,               -- lien avec table pépinière
    source TEXT,                      -- ex. "Zalka_2025", "manuel"
    date_maj TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tâche 2 : Calendrier de plantation & stades de croissance
CREATE TABLE calendrier_croissance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_ferme INTEGER REFERENCES fermes(id_ferme),
    bloc_parcelle TEXT NOT NULL,
    date_plantation TEXT,                 -- saisie manuelle, par bloc
    stade_actuel TEXT,                    -- enum: pepiniere / croissance / production
    phase_annees TEXT,                    -- enum: 0-2 / 3-5 / 5-7 (calendrier Zalka)
    pluviometrie_locale_mm REAL,           -- optionnelle, source externe/API Energy à trancher
    -- age_arbre : NON stocké, calculé depuis date_plantation (Reliability, section 14)
    source TEXT,
    date_maj TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tâche 3 : Inventaire des engrais
CREATE TABLE inventaire_engrais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_ferme INTEGER REFERENCES fermes(id_ferme),
    bloc_parcelle TEXT,                   -- bloc ciblé par l'application
    type_engrais TEXT NOT NULL,
    quantite_stock_kg REAL,
    seuil_alerte_kg REAL,                 -- valeur par défaut prudente, à valider par un agronome
    date_reapprovisionnement TEXT,
    quantite_appliquee_kg REAL,           -- par événement
    fournisseur TEXT,
    responsable_application TEXT,         -- [v3, section 12bis]
    methode_application TEXT,             -- [v3, section 12bis]
    source TEXT,
    date_maj TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tâche 4 : Surveillance des maladies & parasites
CREATE TABLE sante_maladies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_ferme INTEGER REFERENCES fermes(id_ferme),
    bloc_parcelle TEXT NOT NULL,          -- arbre/bloc concerné
    indicateur_sante_pct REAL,            -- barème Zalka 0-100%, stocké en %, affiché en 5 catégories
    type_maladie_parasite TEXT,
    date_observation TEXT,
    statut_traitement TEXT,               -- enum: non_traite / en_cours / traite
    responsable_observation TEXT,         -- [v3, section 12bis]
    methode_surveillance TEXT,            -- [v3, section 12bis]
    source TEXT,                          -- ex. "manuel" ou "api_fencing_security" (Filomene)
    date_maj TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tâche 5 : Alertes de maturité / récolte
CREATE TABLE recoltes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_ferme INTEGER REFERENCES fermes(id_ferme),
    bloc_parcelle TEXT NOT NULL,
    id_lot TEXT UNIQUE,                   -- généré à la récolte, pivot traçabilité export
    statut_maturite TEXT,                 -- enum: immature / mur / pret
    date_recolte_estimee TEXT,
    date_recolte_reelle TEXT,
    quantite_recoltee_kg REAL,
    source TEXT,
    date_maj TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tâche 6 : Gestion de la pépinière
CREATE TABLE pepiniere (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_ferme INTEGER REFERENCES fermes(id_ferme),
    bloc_parcelle TEXT,
    nombre_jeunes_plants INTEGER,
    stade_developpement TEXT,             -- enum fermé (Usability, section 14)
    date_prevue_transplantation TEXT,
    taux_survie_pct REAL,
    origine_plant TEXT,                   -- enum: achat_externe / production_interne
    source TEXT,
    date_maj TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Données de référence (Zalka 2025, cf. section 17.1/17.2 du contexte)
-- Reprises telles quelles comme valeurs par défaut modifiables — pas recalculées.
-- ============================================================

INSERT INTO fermes (nom, region, pluviometrie_mm_an, type_sol)
VALUES ('Banfora', 'Cascades', 1100, 'fertile');

-- Kent and Amélie were hypothetical scenarios compared on the same 2ha in Zalka's Table 1, never actual plantations. Keitt is the only real planted variety. Removed from operational data 06/08, schema corrected 11/08.
INSERT INTO varietes (id_ferme, nom, nombre_arbres, espacement_inter_rang_m, espacement_intra_rang_m, rendement_attendu_kg, bloc_parcelle, source)
VALUES
    (1, 'Keitt', 200, 8, 8, 44000, 'A', 'Zalka_2025');
