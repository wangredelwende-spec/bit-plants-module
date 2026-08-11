# Plants Module API — S1 milestone

## Setup

```bash
pip install -r requirements.txt
```

## 1. Build the database (run once, from the repo root)

```bash
python3 -c "
import sqlite3
conn = sqlite3.connect('database/plants.db')
with open('database/schema.sql') as f:
    conn.executescript(f.read())
conn.commit()
conn.close()
"
```

## 2. Run the API

```bash
cd backend
uvicorn main:app --reload
```

## 3. Try it

- Swagger UI: http://127.0.0.1:8000/docs
- `GET /v1/varieties` — all varieties
- `GET /v1/varieties?bloc_parcelle=B` — filtered by block
- `GET /v1/varieties/{id}` — single variety

## Design notes

- Generic resource endpoint (`/v1/varieties`), never a consumer-specific
  route — any future module (Product Transformation, Crop Storage, Water
  Supply, or one not yet identified) can consume it as-is.
- Versioned from the start (`/v1/...`).
- Every row carries `source` and `date_maj`, so manual entry today can be
  replaced by a real sensor or another module's API later without
  changing this code (abstraction principle already agreed for the
  module).
