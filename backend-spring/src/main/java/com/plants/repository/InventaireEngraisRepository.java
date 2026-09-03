package com.plants.repository;

import com.plants.model.InventaireEngrais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for the `inventaire_engrais` table (Task 3).
 * Read-only, same generic filter pattern as VarieteRepository /
 * CalendrierCroissanceRepository.
 */
@Repository
public interface InventaireEngraisRepository extends JpaRepository<InventaireEngrais, Integer> {

    @Query("SELECT f FROM InventaireEngrais f WHERE " +
           "(:idFerme IS NULL OR f.idFerme = :idFerme) AND " +
           "(:blocParcelle IS NULL OR f.blocParcelle = :blocParcelle)")
    List<InventaireEngrais> findByFilters(
            @Param("idFerme") Integer idFerme,
            @Param("blocParcelle") String blocParcelle
    );
}
