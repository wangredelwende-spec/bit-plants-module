// ============================================================
// Display formatting utilities — mirrors app.js helpers exactly
// ============================================================

/**
 * Returns a React-safe display string for a nullable field.
 * null / undefined / "" → '—' styled with .null-value
 */
export function NullableValue({ value }) {
  if (value === null || value === undefined || value === '') {
    return <span className="null-value">—</span>;
  }
  return <>{String(value)}</>;
}

/**
 * Formats a number with locale separators, or '—' if null.
 */
export function FormatNumber({ value }) {
  if (value === null || value === undefined) {
    return <span className="null-value">—</span>;
  }
  return <>{Number(value).toLocaleString()}</>;
}

/**
 * Formats a date string to "DD Mon YYYY", or '—' if null/invalid.
 */
export function FormatDate({ value }) {
  if (!value) return <span className="null-value">—</span>;
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return <>{value}</>;
    return <>{d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</>;
  } catch {
    return <>{value}</>;
  }
}

/**
 * Displays bloc_parcelle with "Block " prefix for display only.
 * The raw value ('A') is used for API filtering — never modify the raw value.
 */
export function FormatBloc({ value }) {
  if (!value) return <span className="null-value">—</span>;
  return <>Block {value}</>;
}

/**
 * Vigor badge with color coding.
 */
export function VigorBadge({ value }) {
  if (!value) return <span className="null-value">—</span>;
  const colorMap = { Forte: 'green', Moyenne: 'amber', Faible: 'red' };
  const cls = colorMap[value] || 'gray';
  return <span className={`badge badge--${cls}`}>{value}</span>;
}
