package com.plants.controller;

import com.plants.model.InventaireEngrais;
import com.plants.repository.InventaireEngraisRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for the /v1/fertilizer-inventory resource (Task 3).
 *
 * Same conventions as VarieteController / CalendrierCroissanceController:
 * - Versioned path /v1/fertilizer-inventory
 * - Optional query param filters (id_ferme, bloc_parcelle) — non-existent
 *   block returns an empty list, not an error
 * - Read-only — no POST/PUT/DELETE
 * - Non-existent id returns 404
 *
 * CORS: no extra configuration needed here — CorsConfig applies globally.
 */
@RestController
@Tag(name = "Fertilizer Inventory", description = "Task 3 — Fertilizer stock & application history (read-only)")
public class InventaireEngraisController {

    private final InventaireEngraisRepository repository;

    public InventaireEngraisController(InventaireEngraisRepository repository) {
        this.repository = repository;
    }

    /**
     * List all fertilizer inventory records, with optional filters.
     * Returns an empty list (not an error) when no results match — including
     * when the table itself has no rows yet (see database/init.sql note).
     */
    @GetMapping("/v1/fertilizer-inventory")
    @Operation(summary = "List fertilizer inventory records",
               description = "Returns all fertilizer inventory records. Optionally filter by id_ferme and/or bloc_parcelle.")
    public List<InventaireEngrais> getFertilizerInventory(
            @Parameter(description = "Filter by farm id")
            @RequestParam(required = false) Integer id_ferme,

            @Parameter(description = "Filter by block/plot (exact match, e.g. 'A')")
            @RequestParam(required = false) String bloc_parcelle
    ) {
        return repository.findByFilters(id_ferme, bloc_parcelle);
    }

    /**
     * Single fertilizer inventory record by id. Returns 404 if not found.
     */
    @GetMapping("/v1/fertilizer-inventory/{id}")
    @Operation(summary = "Get fertilizer inventory record by id",
               description = "Returns a single fertilizer inventory record, or 404 if not found.")
    public ResponseEntity<InventaireEngrais> getFertilizerInventoryById(
            @Parameter(description = "Fertilizer inventory record id") @PathVariable Integer id
    ) {
        Optional<InventaireEngrais> result = repository.findById(id);
        return result
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------
    // READ-ONLY by design — no POST, PUT, or DELETE endpoints, matching
    // the project-wide decision (see VarieteController) to keep all
    // consumer-facing endpoints GET-only at this stage.
    // ---------------------------------------------------------------
}
