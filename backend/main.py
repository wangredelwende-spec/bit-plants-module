"""
Plants module — backend API
Infineon/BIT Excellence Program 2026

Design principles applied (already documented in project context):
- Generic resource endpoints only, never a consumer-specific endpoint
  (e.g. GET /v1/varieties, never GET /data-for-abdoul)
- API versioned from the start (/v1/...)
- JSON as the universal exchange format
- Every record carries `source` and `date_maj` (abstraction principle,
  so a future IoT sensor or another module's API can replace manual
  entry without changing the application code)
- Business values (spacing, yield, etc.) live in the database, never
  hardcoded as constants (Maintainability, Task 1)
"""

import sqlite3
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

DB_PATH = Path(__file__).resolve().parent.parent / "database" / "plants.db"

app = FastAPI(
    title="Plants Module API",
    description="Digital Twin layer — Plants module (Infineon/BIT Excellence Program 2026)",
    version="1.0.0",
)

# Permissive for now (prototype stage) — to be revisited with Wilfried
# once real inter-module access control is discussed (section 14/15.B).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection() -> sqlite3.Connection:
    if not DB_PATH.exists():
        raise HTTPException(
            status_code=500,
            detail=f"Database not found at {DB_PATH}. Run database/schema.sql first.",
        )
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.get("/")
def root():
    return {"module": "Plants", "status": "ok", "docs": "/docs"}


@app.get("/v1/varieties")
def get_varieties(
    id_ferme: Optional[int] = Query(None, description="Filter by farm id"),
    bloc_parcelle: Optional[str] = Query(None, description="Filter by block/plot"),
):
    """
    Generic resource endpoint — returns all mango varieties tracked in the
    system (Task 1: variety selection & tracking).

    Filters are generic query parameters (never a bespoke endpoint per
    consumer), consistent with the API design rules already agreed.
    """
    conn = get_connection()
    query = "SELECT * FROM varietes WHERE 1=1"
    params = []

    if id_ferme is not None:
        query += " AND id_ferme = ?"
        params.append(id_ferme)
    if bloc_parcelle is not None:
        query += " AND bloc_parcelle = ?"
        params.append(bloc_parcelle)

    rows = conn.execute(query, params).fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/v1/varieties/{variety_id}")
def get_variety(variety_id: int):
    """Single-resource lookup by id."""
    conn = get_connection()
    row = conn.execute("SELECT * FROM varietes WHERE id = ?", (variety_id,)).fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Variety not found")

    return dict(row)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
