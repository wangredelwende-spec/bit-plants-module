/**
 * FilterBar — bloc_parcelle dropdown.
 *
 * Key behaviour:
 * - Dropdown option values are the raw DB values (e.g. 'A').
 * - Display labels are prefixed: "Block A".
 * - The API is called with the raw value (?bloc_parcelle=A), never the prefixed one.
 *
 * Note (Partie A.4): a "Clear filter" button used to sit here. It was removed —
 * the mockup's .filter-bar (on Varieties, Growth Calendar, and Fertilizer Inventory
 * screens alike) only ever contains the label + select, no clear button. Selecting
 * "All blocks" already clears the filter, so `onClear` is unused but kept as a prop
 * for callers that still pass it, to avoid touching call sites unnecessarily.
 */
export default function FilterBar({ blocs, selectedBloc, onBlocChange }) {
  return (
    <div className="filter-bar" id="filter-bar">
      <span className="filter-bar__label">Block / Plot:</span>
      <select
        id="filter-bloc"
        className="filter-bar__select"
        value={selectedBloc}
        onChange={(e) => onBlocChange(e.target.value)}
      >
        <option value="">All blocks</option>
        {blocs.map((b) => (
          // value = raw DB value sent to API; label = prefixed display only
          <option key={b} value={b}>
            Block {b}
          </option>
        ))}
      </select>
    </div>
  );
}
