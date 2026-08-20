import {
  NullableValue,
  FormatNumber,
  FormatDate,
  FormatBloc,
  VigorBadge,
} from './formatters.jsx';

/**
 * Varieties data table.
 * Columns mirror the vanilla app.js renderTable() function exactly.
 * Clicking a row opens the detail modal via onRowClick(id).
 */
export default function VarietiesTable({ data, onRowClick }) {
  if (data.length === 0) return null; // parent renders empty state

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Trees</th>
            <th>Spacing (m)</th>
            <th>Density (/ha)</th>
            <th>Exp. Yield (kg)</th>
            <th>Act. Yield (kg)</th>
            <th>Vigor</th>
            <th>Block</th>
            <th>Origin</th>
            <th>Source</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              data-variety-id={row.id}
              onClick={() => onRowClick(row.id)}
            >
              <td><strong>{row.nom}</strong></td>
              <td><FormatNumber value={row.nombre_arbres} /></td>
              <td>
                {row.espacement_inter_rang_m == null && row.espacement_intra_rang_m == null
                  ? <span className="null-value">—</span>
                  : <>{row.espacement_inter_rang_m ?? '—'} × {row.espacement_intra_rang_m ?? '—'}</>
                }
              </td>
              <td><FormatNumber value={row.densite_arbres_ha} /></td>
              <td><FormatNumber value={row.rendement_attendu_kg} /></td>
              <td><FormatNumber value={row.rendement_reel_kg} /></td>
              <td><VigorBadge value={row.vigueur} /></td>
              <td><FormatBloc value={row.bloc_parcelle} /></td>
              <td><NullableValue value={row.origine_plant} /></td>
              <td><NullableValue value={row.source} /></td>
              <td><FormatDate value={row.date_maj} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
