// ============================================================
// Plants Module — API client (React)
// Connected to Spring Boot backend at localhost:8080
// Task 3: Fertilizer Inventory
// ============================================================

const API_BASE = 'http://localhost:8080';

/**
 * Fetch fertilizer inventory records with optional filters.
 * Omits null/empty params rather than sending them as empty strings.
 */
export async function fetchFertilizerInventory(params = {}) {
  const url = new URL(`${API_BASE}/v1/fertilizer-inventory`);
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
 * Fetch a single fertilizer inventory record by id.
 * Throws on 404 or other errors.
 */
export async function fetchFertilizerInventoryById(id) {
  const res = await fetch(`${API_BASE}/v1/fertilizer-inventory/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Fertilizer inventory record not found');
    throw new Error(`Server returned ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
