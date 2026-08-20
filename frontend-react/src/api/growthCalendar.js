// ============================================================
// Plants Module — API client (React)
// Connected to Spring Boot backend at localhost:8080
// Task 2: Growth Calendar
// ============================================================

const API_BASE = 'http://localhost:8080';

/**
 * Fetch growth calendar entries with optional filters.
 */
export async function fetchGrowthCalendar(params = {}) {
  const url = new URL(`${API_BASE}/v1/growth-calendar`);
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
 * Fetch a single growth calendar entry by id.
 */
export async function fetchGrowthCalendarById(id) {
  const res = await fetch(`${API_BASE}/v1/growth-calendar/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Growth calendar entry not found');
    throw new Error(`Server returned ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
