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
            <th>Variety</th>
            <th>Block</th>
            <th>Trees</th>
            <th>Spacing</th>
            <th>Expected Yield</th>
            <th>Actual Yield</th>
            <th>Vigor</th>
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
              <td><FormatBloc value={row.bloc_parcelle} /></td>
              <td><FormatNumber value={row.nombre_arbres} /></td>
              <td>
                {row.espacement_inter_rang_m == null && row.espacement_intra_rang_m == null
                  ? <span className="null-value">—</span>
                  : <>{row.espacement_inter_rang_m ?? '—'} × {row.espacement_intra_rang_m ?? '—'} m</>
                }
              </td>
              <td>
                {row.rendement_attendu_kg == null
                  ? <span className="null-value">—</span>
                  : <><FormatNumber value={row.rendement_attendu_kg} /> kg</>
                }
              </td>
              <td>
                {row.rendement_reel_kg == null
                  ? <span className="null-value">—</span>
                  : <><FormatNumber value={row.rendement_reel_kg} /> kg</>
                }
              </td>
              <td><VigorBadge value={row.vigueur} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
