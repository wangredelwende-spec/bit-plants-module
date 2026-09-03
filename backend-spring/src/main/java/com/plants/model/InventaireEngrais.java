package com.plants.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

/**
 * Entity mapping the `inventaire_engrais` table (Task 3 — fertilizer inventory).
 *
 * Field names mirror the database column names exactly — no renaming, same
 * convention as Variete.java and CalendrierCroissance.java.
 *
 * IMPORTANT: as of this migration, database/init.sql creates this table but
 * intentionally inserts no rows — no real fertilizer inventory data source
 * (equivalent to the Zalka 2025 figures used for varietes) has been found for
 * this project. GET /v1/fertilizer-inventory will therefore return an empty
 * list until real data is entered; this is expected, not a bug.
 */
@Entity
@Table(name = "inventaire_engrais")
public class InventaireEngrais {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @JsonProperty("id")
    private Integer id;

    @Column(name = "id_ferme")
    @JsonProperty("id_ferme")
    private Integer idFerme;

    @Column(name = "bloc_parcelle")
    @JsonProperty("bloc_parcelle")
    private String blocParcelle;

    @Column(name = "type_engrais", nullable = false)
    @JsonProperty("type_engrais")
    private String typeEngrais;

    @Column(name = "quantite_stock_kg")
    @JsonProperty("quantite_stock_kg")
    private Double quantiteStockKg;

    /**
     * Valeur provisoire, à valider par un agronome (cf. database/schema.sql).
     */
    @Column(name = "seuil_alerte_kg")
    @JsonProperty("seuil_alerte_kg")
    private Double seuilAlerteKg;

    @Column(name = "date_reapprovisionnement")
    @JsonProperty("date_reapprovisionnement")
    private LocalDate dateReapprovisionnement;

    @Column(name = "quantite_appliquee_kg")
    @JsonProperty("quantite_appliquee_kg")
    private Double quantiteAppliqueeKg;

    @Column(name = "fournisseur")
    @JsonProperty("fournisseur")
    private String fournisseur;

    @Column(name = "responsable_application")
    @JsonProperty("responsable_application")
    private String responsableApplication;

    @Column(name = "methode_application")
    @JsonProperty("methode_application")
    private String methodeApplication;

    @Column(name = "source")
    @JsonProperty("source")
    private String source;

    @Column(name = "date_maj")
    @JsonProperty("date_maj")
    private OffsetDateTime dateMaj;

    // --- Getters and Setters ---

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdFerme() { return idFerme; }
    public void setIdFerme(Integer idFerme) { this.idFerme = idFerme; }

    public String getBlocParcelle() { return blocParcelle; }
    public void setBlocParcelle(String blocParcelle) { this.blocParcelle = blocParcelle; }

    public String getTypeEngrais() { return typeEngrais; }
    public void setTypeEngrais(String typeEngrais) { this.typeEngrais = typeEngrais; }

    public Double getQuantiteStockKg() { return quantiteStockKg; }
    public void setQuantiteStockKg(Double quantiteStockKg) { this.quantiteStockKg = quantiteStockKg; }

    public Double getSeuilAlerteKg() { return seuilAlerteKg; }
    public void setSeuilAlerteKg(Double seuilAlerteKg) { this.seuilAlerteKg = seuilAlerteKg; }

    public LocalDate getDateReapprovisionnement() { return dateReapprovisionnement; }
    public void setDateReapprovisionnement(LocalDate dateReapprovisionnement) { this.dateReapprovisionnement = dateReapprovisionnement; }

    public Double getQuantiteAppliqueeKg() { return quantiteAppliqueeKg; }
    public void setQuantiteAppliqueeKg(Double quantiteAppliqueeKg) { this.quantiteAppliqueeKg = quantiteAppliqueeKg; }

    public String getFournisseur() { return fournisseur; }
    public void setFournisseur(String fournisseur) { this.fournisseur = fournisseur; }

    public String getResponsableApplication() { return responsableApplication; }
    public void setResponsableApplication(String responsableApplication) { this.responsableApplication = responsableApplication; }

    public String getMethodeApplication() { return methodeApplication; }
    public void setMethodeApplication(String methodeApplication) { this.methodeApplication = methodeApplication; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public OffsetDateTime getDateMaj() { return dateMaj; }
    public void setDateMaj(OffsetDateTime dateMaj) { this.dateMaj = dateMaj; }
}
