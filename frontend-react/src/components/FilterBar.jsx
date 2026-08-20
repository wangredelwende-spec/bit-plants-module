/**
 * FilterBar — bloc_parcelle dropdown + clear button.
 *
 * Key behaviour:
 * - Dropdown option values are the raw DB values (e.g. 'A').
 * - Display labels are prefixed: "Block A".
 * - The API is called with the raw value (?bloc_parcelle=A), never the prefixed one.
 */
export default function FilterBar({ blocs, selectedBloc, onBlocChange, onClear }) {
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
      <button
        id="btn-clear-filter"
        className="filter-bar__btn"
        type="button"
        onClick={onClear}
      >
        Clear filter
      </button>
    </div>
  );
}
