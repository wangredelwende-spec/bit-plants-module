package com.plants.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

/**
 * Entity mapping the `fermes` table (Task 1 scope).
 * Field names mirror the database column names exactly — no renaming.
 */
@Entity
@Table(name = "fermes")
public class Ferme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ferme")
    @JsonProperty("id_ferme")
    private Integer idFerme;

    @Column(name = "nom", nullable = false)
    @JsonProperty("nom")
    private String nom;

    @Column(name = "region")
    @JsonProperty("region")
    private String region;

    @Column(name = "pluviometrie_mm_an")
    @JsonProperty("pluviometrie_mm_an")
    private Double pluviometrieMMAN;

    @Column(name = "type_sol")
    @JsonProperty("type_sol")
    private String typeSol;

    @Column(name = "date_creation")
    @JsonProperty("date_creation")
    private OffsetDateTime dateCreation;

    // --- Getters and Setters ---

    public Integer getIdFerme() { return idFerme; }
    public void setIdFerme(Integer idFerme) { this.idFerme = idFerme; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Double getPluviometrieMMAN() { return pluviometrieMMAN; }
    public void setPluviometrieMMAN(Double pluviometrieMMAN) { this.pluviometrieMMAN = pluviometrieMMAN; }

    public String getTypeSol() { return typeSol; }
    public void setTypeSol(String typeSol) { this.typeSol = typeSol; }

    public OffsetDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(OffsetDateTime dateCreation) { this.dateCreation = dateCreation; }
}
