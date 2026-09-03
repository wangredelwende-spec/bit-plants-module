import { useState, useEffect, useCallback } from 'react';
import { fetchFertilizerInventory } from '../api/fertilizers.js';
import FilterBar from './FilterBar.jsx';
import { LoadingState, ErrorState } from './StateMessages.jsx';
import { FormatNumber, FormatDate, FormatBloc } from './formatters.jsx';
import AppHeader from './AppHeader.jsx';

/**
 * Status badge for Current Stock rows — green/amber/red, same badge system
 * (className pattern) as VigorBadge in formatters.jsx and StageBadge in
 * GrowthCalendarScreen.jsx.
 *
 * The mockup marks status per row (OK / Attention / Low stock) without stating
 * an explicit formula, and its own caption says "Alert threshold is provisional,
 * to be validated by an agronomist." Reverse-engineering the mockup's 4 example
 * rows (NPK 120/150→Low, Urea 80/100→Low, Potassium 250/100→OK,
 * Flowering booster 45/30→Attention) fits a "how many alert-thresholds of
 * buffer above the threshold" rule:
 *   stock < threshold        → red   (Low stock)
 *   stock < 2 × threshold    → amber (Attention)
 *   stock >= 2 × threshold   → green (OK)
 * This is a derived UI heuristic, not a real farm-data value — like the
 * mockup itself, it is provisional pending agronomist validation.
 */
function StockStatusBadge({ stockKg, thresholdKg }) {
  if (stockKg == null || thresholdKg == null) {
    return <span className="null-value">—</span>;
  }
  if (stockKg < thresholdKg) {
    return <span className="badge badge--red">Low stock</span>;
  }
  if (stockKg < thresholdKg * 2) {
    return <span className="badge badge--amber">Attention</span>;
  }
  return <span className="badge badge--green">OK</span>;
}

/**
 * Stock Level Trend chart — raw SVG, same technique as YieldOverviewCharts.jsx
 * (dynamic viewBox sized to data length, two polylines with point markers).
 * Only rows with both quantite_stock_kg and seuil_alerte_kg present are
 * plotted — a row missing either value cannot be positioned on the chart.
 */
function StockLevelTrendChart({ data }) {
  const plottable = data.filter((d) => d.quantite_stock_kg != null && d.seuil_alerte_kg != null);
  if (plottable.length === 0) return null;

  const maxVal = Math.max(1, ...plottable.map((d) => Math.max(d.quantite_stock_kg, d.seuil_alerte_kg)));
  const CHART_TOP = 40;
  const CHART_BOTTOM = 180;
  const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP;
  const STEP_X = 160;
  const viewBoxWidth = Math.max(600, 40 + plottable.length * STEP_X);

  const pointX = (i) => 60 + i * STEP_X;
  const pointY = (v) => CHART_BOTTOM - (v / maxVal) * CHART_HEIGHT;

  const stockPoints = plottable.map((d, i) => `${pointX(i)},${pointY(d.quantite_stock_kg)}`).join(' ');
  const thresholdPoints = plottable.map((d, i) => `${pointX(i)},${pointY(d.seuil_alerte_kg)}`).join(' ');

  return (
    <div className="card">
      <svg viewBox={`0 0 ${viewBoxWidth} 200`} width="100%" height="190" preserveAspectRatio="none">
        <line x1="40" y1="40" x2={viewBoxWidth - 20} y2="40" stroke="#eef2f1" strokeWidth="1" />
        <line x1="40" y1="85" x2={viewBoxWidth - 20} y2="85" stroke="#eef2f1" strokeWidth="1" />
        <line x1="40" y1="130" x2={viewBoxWidth - 20} y2="130" stroke="#eef2f1" strokeWidth="1" />
        <line x1="40" y1="180" x2={viewBoxWidth - 20} y2="180" stroke="#dfe7e5" strokeWidth="1" />

        <polyline points={stockPoints} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {plottable.map((d, i) => (
          <circle key={`stock-${i}`} cx={pointX(i)} cy={pointY(d.quantite_stock_kg)} r="4.5" fill="var(--primary)" />
        ))}

        <polyline points={thresholdPoints} fill="none" stroke="var(--orange)" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />
        {plottable.map((d, i) => (
          <circle key={`threshold-${i}`} cx={pointX(i)} cy={pointY(d.seuil_alerte_kg)} r="4.5" fill="var(--orange)" />
        ))}

        {plottable.map((d, i) => (
          <text key={`label-${i}`} x={pointX(i)} y="196" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#5b6b66">
            {d.type_engrais}
          </text>
        ))}
      </svg>
      <div className="legend-row" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--muted)', fontWeight: 500, flexWrap: 'wrap' }}>
        <span><span className="legend-dot" style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '2px', marginRight: '5px', background: 'var(--primary)' }}></span>Current Stock (kg)</span>
        <span><span className="legend-dot" style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '2px', marginRight: '5px', background: 'var(--orange)' }}></span>Alert Threshold (kg)</span>
      </div>
    </div>
  );
}

/**
 * Inline empty state for a single section — never replaces the whole page.
 * Uses a muted card style, not the full-page EmptyState component.
 */
function SectionEmpty({ message }) {
  return (
    <div className="card" style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '32px 16px' }}>
      {message}
    </div>
  );
}

export default function FertilizerInventoryScreen({ onHome }) {
  const [records, setRecords] = useState([]);
  const [blocs, setBlocs] = useState([]);
  const [selectedBloc, setSelectedBloc] = useState('');
  // 'loading' | 'ok' | 'error' — never 'empty': empty data renders per-section
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = useCallback(async (bloc) => {
    setStatus('loading');
    try {
      const params = {};
      if (bloc) params.bloc_parcelle = bloc;

      const data = await fetchFertilizerInventory(params);

      if (!bloc) {
        const uniqueBlocs = [...new Set(data.map((r) => r.bloc_parcelle).filter(Boolean))].sort();
        setBlocs(uniqueBlocs);
      }

      setRecords(data);
      // Always transition to 'ok' — each section handles its own empty state
      setStatus('ok');
    } catch (err) {
      const msg =
        err.message.includes('Failed to fetch') || err.message.includes('NetworkError')
          ? 'Unable to reach the backend server — check that it is running on localhost:8080'
          : err.message;
      setErrorMsg(msg);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadData('');
  }, [loadData]);

  const handleBlocChange = (bloc) => {
    setSelectedBloc(bloc);
    loadData(bloc);
  };

  const handleRetry = () => {
    loadData(selectedBloc);
  };

  // Application History: rows that represent an actual application event
  // (quantite_appliquee_kg present). date_maj is used as the event date —
  // there is no separate "application date" column in inventaire_engrais
  // (see database/schema.sql); this is a structural assumption, flagged in
  // the final report, not a fabricated value.
  const applicationHistory = records.filter((r) => r.quantite_appliquee_kg != null);

  return (
    <main className="main-content">
      <AppHeader
        eyebrow="Task 3"
        title="Fertilizer Inventory"
        description="Stock, alert thresholds, and application history by block."
        onHome={onHome}
      />

      <FilterBar
        blocs={blocs}
        selectedBloc={selectedBloc}
        onBlocChange={handleBlocChange}
      />

      {/* Global loading/error states — only these block the whole screen */}
      {status === 'loading' && <LoadingState message="Loading fertilizer inventory…" />}
      {status === 'error' && <ErrorState message={errorMsg} onRetry={handleRetry} />}

      {/* When data is loaded (even if empty list), always show all 3 sections */}
      {status === 'ok' && (
        <>
          {/* ---- Section 1: Current Stock ---- */}
          <h3 className="section-title font-heading">Current Stock</h3>
          {records.length === 0 ? (
            <SectionEmpty message="No fertilizer stock recorded yet." />
          ) : (
            <>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fertilizer</th>
                      <th>Stock (kg)</th>
                      <th>Alert Threshold (kg)</th>
                      <th>Status</th>
                      <th>Last Restock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row) => (
                      <tr key={row.id} data-fertilizer-id={row.id}>
                        <td><strong>{row.type_engrais}</strong></td>
                        <td><FormatNumber value={row.quantite_stock_kg} /></td>
                        <td><FormatNumber value={row.seuil_alerte_kg} /></td>
                        <td><StockStatusBadge stockKg={row.quantite_stock_kg} thresholdKg={row.seuil_alerte_kg} /></td>
                        <td><FormatDate value={row.date_reapprovisionnement} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted" style={{ fontSize: '12px', marginTop: '8px' }}>
                Alert threshold is provisional, to be validated by an agronomist.
              </p>
            </>
          )}

          {/* ---- Section 2: Stock Level Trend ---- */}
          <h3 className="section-title font-heading" style={{ marginTop: '28px' }}>Stock Level Trend</h3>
          {records.length === 0 ? (
            <SectionEmpty message="No stock data to chart yet." />
          ) : (
            <StockLevelTrendChart data={records} />
          )}

          {/* ---- Section 3: Application History ---- */}
          <h3 className="section-title font-heading" style={{ marginTop: '28px' }}>Application History</h3>
          {applicationHistory.length === 0 ? (
            <SectionEmpty message="No application history recorded yet." />
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Fertilizer</th>
                    <th>Quantity (kg)</th>
                    <th>Block</th>
                  </tr>
                </thead>
                <tbody>
                  {applicationHistory.map((row) => (
                    <tr key={`app-${row.id}`}>
                      <td><FormatDate value={row.date_maj} /></td>
                      <td>{row.type_engrais}</td>
                      <td><FormatNumber value={row.quantite_appliquee_kg} /></td>
                      <td><FormatBloc value={row.bloc_parcelle} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}
