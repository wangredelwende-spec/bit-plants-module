package com.plants;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Plants Module API — entry point.
 * Digital Twin layer (Infineon/BIT Excellence Program 2026).
 *
 * Design principles applied (mirrors the original FastAPI backend):
 * - Generic resource endpoints only, never a consumer-specific endpoint
 *   (e.g. GET /v1/varieties, never GET /data-for-abdoul)
 * - API versioned from the start (/v1/...)
 * - JSON as the universal exchange format
 * - Every record carries `source` and `date_maj` (abstraction principle)
 * - Business values live in the database, never hardcoded
 */
@SpringBootApplication
public class PlantsApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlantsApplication.class, args);
    }
}
