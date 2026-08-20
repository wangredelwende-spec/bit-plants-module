package com.plants.repository;

import com.plants.model.Variete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for the `varietes` table.
 * Read-only use at this stage — Task 1 is read-only by design decision.
 */
@Repository
public interface VarieteRepository extends JpaRepository<Variete, Integer> {

    /**
     * Generic filtered query — mirrors the FastAPI WHERE 1=1 + optional ANDs pattern.
     * Both filters are optional; null means "no filter applied for that parameter".
     */
    @Query("SELECT v FROM Variete v WHERE " +
           "(:idFerme IS NULL OR v.idFerme = :idFerme) AND " +
           "(:blocParcelle IS NULL OR v.blocParcelle = :blocParcelle)")
    List<Variete> findByFilters(
            @Param("idFerme") Integer idFerme,
            @Param("blocParcelle") String blocParcelle
    );
}
