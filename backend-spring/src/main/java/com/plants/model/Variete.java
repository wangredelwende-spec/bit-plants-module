package com.plants.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

/**
 * Entity mapping the `varietes` table (Task 1 — variety selection & tracking).
 *
 * Field names mirror the database column names exactly — no renaming.
 * NULL fields (vigueur, origine_plant, densite_arbres_ha, rendement_reel_kg)
 * are intentional: data not available in the Zalka 2025 source.
 * Do NOT assign default values to these fields.
 */
@Entity
@Table(name = "varietes")
public class Variete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @JsonProperty("id")
    private Integer id;

    @Column(name = "id_ferme")
    @JsonProperty("id_ferme")
    private Integer idFerme;

    @Column(name = "nom", nullable = false)
    @JsonProperty("nom")
    private String nom;

    @Column(name = "nombre_arbres")
    @JsonProperty("nombre_arbres")
    private Integer nombreArbres;

    @Column(name = "espacement_inter_rang_m")
    @JsonProperty("espacement_inter_rang_m")
    private Double espacementInterRangM;

    @Column(name = "espacement_intra_rang_m")
    @JsonProperty("espacement_intra_rang_m")
    private Double espacementIntraRangM;

    /**
     * NULL volontaire — donnée non disponible dans le chiffrage source (Zalka 2025).
     * Ne pas calculer ni inventer une valeur par défaut.
     */
    @Column(name = "densite_arbres_ha")
    @JsonProperty("densite_arbres_ha")
    private Double densiteArbresHa;

    @Column(name = "rendement_attendu_kg")
    @JsonProperty("rendement_attendu_kg")
    private Double rendementAttenduKg;

    /**
     * NULL volontaire — distinct du rendement attendu (section 12 du contexte projet).
     */
    @Column(name = "rendement_reel_kg")
    @JsonProperty("rendement_reel_kg")
    private Double rendementReelKg;

    /**
     * NULL volontaire — donnée non disponible dans le chiffrage source.
     */
    @Column(name = "vigueur")
    @JsonProperty("vigueur")
    private String vigueur;

    @Column(name = "bloc_parcelle")
    @JsonProperty("bloc_parcelle")
    private String blocParcelle;

    /**
     * NULL volontaire — lien avec table pépinière, pas encore renseigné.
     */
    @Column(name = "origine_plant")
    @JsonProperty("origine_plant")
    private String originePlant;

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

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public Integer getNombreArbres() { return nombreArbres; }
    public void setNombreArbres(Integer nombreArbres) { this.nombreArbres = nombreArbres; }

    public Double getEspacementInterRangM() { return espacementInterRangM; }
    public void setEspacementInterRangM(Double espacementInterRangM) { this.espacementInterRangM = espacementInterRangM; }

    public Double getEspacementIntraRangM() { return espacementIntraRangM; }
    public void setEspacementIntraRangM(Double espacementIntraRangM) { this.espacementIntraRangM = espacementIntraRangM; }

    public Double getDensiteArbresHa() { return densiteArbresHa; }
    public void setDensiteArbresHa(Double densiteArbresHa) { this.densiteArbresHa = densiteArbresHa; }

    public Double getRendementAttenduKg() { return rendementAttenduKg; }
    public void setRendementAttenduKg(Double rendementAttenduKg) { this.rendementAttenduKg = rendementAttenduKg; }

    public Double getRendementReelKg() { return rendementReelKg; }
    public void setRendementReelKg(Double rendementReelKg) { this.rendementReelKg = rendementReelKg; }

    public String getVigueur() { return vigueur; }
    public void setVigueur(String vigueur) { this.vigueur = vigueur; }

    public String getBlocParcelle() { return blocParcelle; }
    public void setBlocParcelle(String blocParcelle) { this.blocParcelle = blocParcelle; }

    public String getOriginePlant() { return originePlant; }
    public void setOriginePlant(String originePlant) { this.originePlant = originePlant; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public OffsetDateTime getDateMaj() { return dateMaj; }
    public void setDateMaj(OffsetDateTime dateMaj) { this.dateMaj = dateMaj; }
}
