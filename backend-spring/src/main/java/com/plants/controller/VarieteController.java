package com.plants.controller;

import com.plants.model.Variete;
import com.plants.repository.VarieteRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for the /v1/varieties resource.
 *
 * Design principles applied (mirrors the original FastAPI backend):
 * - Generic resource endpoints only — /v1/varieties, never /data-for-consumer
 * - Versioned from the start (/v1/...)
 * - Read-only at this stage (Task 1 decision) — no POST/PUT/DELETE
 * - Filtering via generic query parameters, not dedicated endpoints
 * - Field names in JSON responses match the DB column names exactly
 */
@RestController
@Tag(name = "Varieties", description = "Task 1 — Mango variety selection & tracking (read-only)")
public class VarieteController {

    private final VarieteRepository varieteRepository;

    public VarieteController(VarieteRepository varieteRepository) {
        this.varieteRepository = varieteRepository;
    }

    /**
     * Health check — mirrors FastAPI GET /
     */
    @GetMapping("/")
    @Operation(summary = "Health check", description = "Returns module name, status, and docs URL")
    public Map<String, String> root() {
        return Map.of(
                "module", "Plants",
                "status", "ok",
                "docs", "/swagger-ui.html"
        );
    }

    /**
     * List all varieties, with optional filters.
     * Returns an empty list (not an error) when no results match.
     */
    @GetMapping("/v1/varieties")
    @Operation(summary = "List varieties",
               description = "Returns all mango varieties. Optionally filter by id_ferme and/or bloc_parcelle.")
    public List<Variete> getVarieties(
            @Parameter(description = "Filter by farm id")
            @RequestParam(required = false) Integer id_ferme,

            @Parameter(description = "Filter by block/plot (exact match, e.g. 'A')")
            @RequestParam(required = false) String bloc_parcelle
    ) {
        return varieteRepository.findByFilters(id_ferme, bloc_parcelle);
    }

    /**
     * Single variety by id. Returns 404 if not found.
     */
    @GetMapping("/v1/varieties/{variety_id}")
    @Operation(summary = "Get variety by id",
               description = "Returns a single variety record, or 404 if not found.")
    public ResponseEntity<Variete> getVariety(
            @Parameter(description = "Variety id") @PathVariable Integer variety_id
    ) {
        Optional<Variete> result = varieteRepository.findById(variety_id);
        return result
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------
    // READ-ONLY by design — no POST, PUT, or DELETE endpoints.
    // Task 1 is variety tracking in read mode. CRUD will be addressed
    // in a later task once the team has agreed on write access rules.
    // ---------------------------------------------------------------
}
