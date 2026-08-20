package com.plants.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.Period;

/**
 * JPA entity mapping the calendrier_croissance table.
 *
 * IMPORTANT — age_arbre (tree_age_years):
 *   NOT stored in the database. Calculated at query time from date_plantation.
 *   This is the non-negotiable Reliability constraint for Task 2:
 *   a manually-entered age could diverge from reality, a calculated age cannot.
 *
 * stade_actuel and phase_annees:
 *   Values are PROVISIONAL — the thresholds and terminology
 *   (pepiniere/croissance/production) are agronomic decisions, not technical ones.
 */
@Entity
@Table(name = "calendrier_croissance")
public class CalendrierCroissance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_ferme")
    @JsonProperty("id_ferme")
    private Integer idFerme;

    @Column(name = "bloc_parcelle", nullable = false)
    @JsonProperty("bloc_parcelle")
    private String blocParcelle;

    @Column(name = "date_plantation")
    @JsonProperty("date_plantation")
    private LocalDate datePlantation;

    @Column(name = "precision_date")
    @JsonProperty("precision_date")
    private String precisionDate;

    @Column(name = "stade_actuel")
    @JsonProperty("stade_actuel")
    private String stadeActuel;

    @Column(name = "phase_annees")
    @JsonProperty("phase_annees")
    private String phaseAnnees;

    @Column(name = "pluviometrie_locale_mm")
    @JsonProperty("pluviometrie_locale_mm")
    private Double pluviometrieLocaleMm;

    @Column(name = "source")
    @JsonProperty("source")
    private String source;

    @Column(name = "date_maj")
    @JsonProperty("date_maj")
    private OffsetDateTime dateMaj;

    // ---------------------------------------------------------------
    // Computed field: tree age — NEVER stored, calculated on the fly.
    // Format: "X yrs Y mo" (e.g. "4 yrs 5 mo")
    // Returns null if date_plantation is null.
    // ---------------------------------------------------------------
    @Transient
    @JsonProperty("tree_age_years")
    public String getTreeAgeYears() {
        if (datePlantation == null) {
            return null;
        }
        Period age = Period.between(datePlantation, LocalDate.now());
        int years = age.getYears();
        int months = age.getMonths();
        if (years == 0) {
            return months + " mo";
        }
        return years + " yrs " + months + " mo";
    }

    // --- Getters & Setters ---

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdFerme() { return idFerme; }
    public void setIdFerme(Integer idFerme) { this.idFerme = idFerme; }

    public String getBlocParcelle() { return blocParcelle; }
    public void setBlocParcelle(String blocParcelle) { this.blocParcelle = blocParcelle; }

    public LocalDate getDatePlantation() { return datePlantation; }
    public void setDatePlantation(LocalDate datePlantation) { this.datePlantation = datePlantation; }

    public String getPrecisionDate() { return precisionDate; }
    public void setPrecisionDate(String precisionDate) { this.precisionDate = precisionDate; }

    public String getStadeActuel() { return stadeActuel; }
    public void setStadeActuel(String stadeActuel) { this.stadeActuel = stadeActuel; }

    public String getPhaseAnnees() { return phaseAnnees; }
    public void setPhaseAnnees(String phaseAnnees) { this.phaseAnnees = phaseAnnees; }

    public Double getPluviometrieLocaleMm() { return pluviometrieLocaleMm; }
    public void setPluviometrieLocaleMm(Double pluviometrieLocaleMm) { this.pluviometrieLocaleMm = pluviometrieLocaleMm; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public OffsetDateTime getDateMaj() { return dateMaj; }
    public void setDateMaj(OffsetDateTime dateMaj) { this.dateMaj = dateMaj; }
}
