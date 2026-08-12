# Frontend — Plants Module (Connected)

This directory contains the **real, connected frontend** for the Plants module, starting with Task 1 (Variety Management). It fetches live data from the FastAPI backend.

> **Not to be confused with `../mockup/`**, which is a static UX prototype with hardcoded data, kept as visual reference only.

## Quick Start

1. **Start the backend** (requires Python + FastAPI + Uvicorn):
   ```bash
   cd backend
   python main.py
   ```
   The API will be available at `http://localhost:8000` (Swagger docs at `/docs`).

2. **Open the frontend**:
   Open `frontend/index.html` directly in your browser (no build step, no server needed).

## Architecture

```
frontend/
├── index.html    # Semantic HTML5 structure
├── styles.css    # Design system (tokens from mockup, rebuilt cleanly)
├── app.js        # Vanilla JS — API calls, rendering, state management
└── README.md     # This file
```

- **Zero dependencies**: Pure HTML/CSS/JS, no frameworks, no bundler.
- **API base URL**: Configured as `API_BASE` constant in `app.js` (default: `http://localhost:8000`).
- **Scope**: Task 1 (Varieties) only. Other tasks (Calendar, Fertilizers, Diseases, Harvest, Nursery) are not yet implemented.

## Features

- Variety list table with data from `GET /v1/varieties`
- Detail modal via `GET /v1/varieties/{id}`
- Filter by block (`bloc_parcelle` query parameter)
- Loading spinner during API calls
- Error state with retry button when backend is unreachable
- Empty state when no records match the filter
- Null values displayed as "—" (italic, gray)
- Block codes reformatted for display ("A" → "Block A")
