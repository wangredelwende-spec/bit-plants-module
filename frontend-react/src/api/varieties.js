// ============================================================
// Plants Module — API client (React)
// Connected to Spring Boot backend at localhost:8080
//
// Design principles (same as FastAPI backend):
// - Generic resource endpoints (/v1/varieties)
// - Field names in responses match DB column names exactly
// ============================================================

const API_BASE = 'http://localhost:8080';

/**
 * Fetch varieties with optional filters.
 * Omits null/empty params rather than sending them as empty strings.
 */
export async function fetchVarieties(params = {}) {
  const url = new URL(`${API_BASE}/v1/varieties`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Fetch a single variety by id.
 * Throws on 404 or other errors.
 */
export async function fetchVarietyById(id) {
  const res = await fetch(`${API_BASE}/v1/varieties/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Variety not found');
    throw new Error(`Server returned ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
