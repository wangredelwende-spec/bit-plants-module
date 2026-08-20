package com.plants.controller;

import com.plants.model.CalendrierCroissance;
import com.plants.repository.CalendrierCroissanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller for growth calendar entries (Task 2).
 *
 * Same API conventions as VarieteController:
 * - Versioned path /v1/growth-calendar
 * - Optional query param filters (id_ferme, bloc_parcelle)
 * - Read-only — no POST/PUT/DELETE
 * - tree_age_years is computed on the fly by the entity's @Transient getter
 */
@RestController
public class CalendrierCroissanceController {

    private final CalendrierCroissanceRepository repository;

    public CalendrierCroissanceController(CalendrierCroissanceRepository repository) {
        this.repository = repository;
    }

    /**
     * GET /v1/growth-calendar — list all entries, with optional filters.
     */
    @GetMapping("/v1/growth-calendar")
    public List<CalendrierCroissance> list(
            @RequestParam(name = "id_ferme", required = false) Integer idFerme,
            @RequestParam(name = "bloc_parcelle", required = false) String blocParcelle) {
        return repository.findByFilters(idFerme, blocParcelle);
    }

    /**
     * GET /v1/growth-calendar/{id} — single entry or 404.
     */
    @GetMapping("/v1/growth-calendar/{id}")
    public ResponseEntity<CalendrierCroissance> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
