# Plants Module — Database Setup

This folder contains the data model for the Plants module (Infineon/BIT
Excellence Program 2026) and the script needed to generate the working
SQLite database from scratch.

## Files

| File | Purpose |
|---|---|
| `schema.sql` | Creates the 7 tables (farms, varieties, growth calendar, fertilizer inventory, disease monitoring, harvests, nursery) and pre-loads the 2025 cohort reference data (Kent, Keitt, Amelie varieties — source: Zalka 2025). |
| `plants_class_diagram.mmd` | UML class diagram of the data model (Mermaid format). |
| `plants.db` | **Not committed to this repository** (see below). This is the actual SQLite database file, generated locally from `schema.sql`. |

## Why `plants.db` is not in the repository

`plants.db` is a generated binary file, not source code — committing it
would cause merge conflicts and make the repo history unreadable. Instead,
anyone working on this project generates it locally in one command (below).
This keeps `schema.sql` as the single source of truth for the data
structure.

## Prerequisites

You need the `sqlite3` command-line tool. It is **not included by default
on Windows**.

1. Go to https://sqlite.org/download.html
2. Under **"Precompiled Binaries for Windows"**, download
   **`sqlite-tools-win-x64-XXXXXXX.zip`**
   ⚠️ Do not download `sqlite-dll-win-x64...` by mistake — that one only
   contains a library (`.dll`), not the `sqlite3.exe` command-line tool.
3. Extract the zip (e.g. to `C:\sqlite`). You should now see `sqlite3.exe`
   in that folder.

macOS and Linux users usually already have `sqlite3` installed
(check with `sqlite3 --version` in a terminal).

## Generate the database

From this `database/` folder, run:

```bash
sqlite3 plants.db < schema.sql
```

On Windows, if `sqlite3` is not on your PATH, use the full path to the
executable instead, for example:

```bash
C:\sqlite\sqlite3.exe plants.db < schema.sql
```

This creates `plants.db` in this same folder — which is exactly where
`backend/main.py` expects to find it
(`database/plants.db`, relative to the backend folder).

## Verify it worked

```bash
sqlite3 plants.db "SELECT * FROM varietes;"
```

You should see 3 rows: Kent (40,000 kg), Keitt (44,000 kg), and Amelie
(32,000 kg), all with `source = "Zalka_2025"`.

## Next step

Once `plants.db` exists here, go to `../backend/` and follow its own
README (or run `pip install -r requirements.txt` then `python main.py`)
to start the API.
