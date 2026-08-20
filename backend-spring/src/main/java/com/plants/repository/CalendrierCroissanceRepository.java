package com.plants.repository;

import com.plants.model.CalendrierCroissance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Repository for calendrier_croissance — same filter pattern as VarieteRepository.
 */
public interface CalendrierCroissanceRepository extends JpaRepository<CalendrierCroissance, Integer> {

    @Query("SELECT c FROM CalendrierCroissance c " +
           "WHERE (:idFerme IS NULL OR c.idFerme = :idFerme) " +
           "AND (:blocParcelle IS NULL OR c.blocParcelle = :blocParcelle)")
    List<CalendrierCroissance> findByFilters(
        @Param("idFerme") Integer idFerme,
        @Param("blocParcelle") String blocParcelle
    );
}
