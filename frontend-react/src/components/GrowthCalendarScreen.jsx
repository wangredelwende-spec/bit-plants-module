import { useState, useEffect, useCallback } from 'react';
import { fetchGrowthCalendar } from '../api/growthCalendar.js';
import FilterBar from './FilterBar.jsx';
import { LoadingState, ErrorState, EmptyState } from './StateMessages.jsx';
import { NullableValue, FormatDate, FormatBloc } from './formatters.jsx';

/**
 * Stage Badge with color coding based on provisional values.
 */
function StageBadge({ value }) {
  if (!value) return <span className="null-value">—</span>;
  const valLower = value.toLowerCase();
  let cls = 'gray';
  if (valLower === 'production') cls = 'green';
  else if (valLower === 'croissance' || valLower === 'growth') cls = 'amber';
  
  return <span className={`badge badge--${cls}`}>{value}</span>;
}

/**
 * Formats a rainfall number with mm suffix, or '—' if null.
 */
function FormatRainfall({ value }) {
  if (value === null || value === undefined) {
    return <span className="null-value">—</span>;
  }
  return <>{Number(value).toLocaleString()} mm</>;
}

export default function GrowthCalendarScreen() {
  const [entries, setEntries] = useState([]);
  const [blocs, setBlocs] = useState([]);          
  const [selectedBloc, setSelectedBloc] = useState('');
  const [status, setStatus] = useState('loading'); 
  const [errorMsg, setErrorMsg] = useState('');
  // const [selectedEntryId, setSelectedEntryId] = useState(null); // Detail modal not strictly spec'd in mockup for this screen, but could add if needed. Keeping it simple for now as requested.

  const loadData = useCallback(async (bloc) => {
    setStatus('loading');
    try {
      const params = {};
      if (bloc) params.bloc_parcelle = bloc;

      const data = await fetchGrowthCalendar(params);

      // Extract unique blocs for dropdown
      if (!bloc) {
        const uniqueBlocs = [...new Set(data.map((r) => r.bloc_parcelle).filter(Boolean))].sort();
        setBlocs(uniqueBlocs);
      }

      setEntries(data);
      setStatus(data.length === 0 ? 'empty' : 'ok');
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

  const handleClearFilter = () => {
    setSelectedBloc('');
    loadData('');
  };

  const handleRetry = () => {
    loadData(selectedBloc);
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <h1 className="page-header__title">Planting Calendar &amp; Growth Stages</h1>
        <p className="page-header__subtitle">
          Task 2 — Manage orchard timelines and agronomic stages
        </p>
      </div>

      <FilterBar
        blocs={blocs}
        selectedBloc={selectedBloc}
        onBlocChange={handleBlocChange}
        onClear={handleClearFilter}
      />
      
      <h3 className="section-title">Growth Phases</h3>
      <div className="timeline">
        <div className="timeline__phase">
          <div className="timeline__phase-bar timeline__phase-bar--past"></div>
          <span className="timeline__phase-label">0–2 yrs<br/><small>Establishment</small></span>
        </div>
        <div className="timeline__phase">
          <div className="timeline__phase-bar timeline__phase-bar--active"></div>
          <span className="timeline__phase-label">3–5 yrs<br/><small>Ramp-up production</small></span>
          <div className="timeline__marker" style={{left: '40%'}}></div>
        </div>
        <div className="timeline__phase">
          <div className="timeline__phase-bar"></div>
          <span className="timeline__phase-label">5–7 yrs<br/><small>Full production</small></span>
        </div>
      </div>

      <section id="table-section" className="fade-in" style={{ marginTop: 'var(--space-xl)' }}>
        {status === 'loading' && <LoadingState />}
        {status === 'error'   && <ErrorState message={errorMsg} onRetry={handleRetry} />}
        {status === 'empty'   && <EmptyState />}
        {status === 'ok'      && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Block</th>
                  <th>Planting Date</th>
                  <th>Precision</th>
                  <th>Age</th>
                  <th>Stage</th>
                  <th>Phase</th>
                  <th>Rainfall</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((row) => (
                  <tr key={row.id} data-calendar-id={row.id}>
                    <td><strong><FormatBloc value={row.bloc_parcelle} /></strong></td>
                    <td><FormatDate value={row.date_plantation} /></td>
                    <td><NullableValue value={row.precision_date} /></td>
                    <td>
                      <NullableValue value={row.tree_age_years} />
                      {row.tree_age_years && <span className="text-disclaimer" style={{ marginLeft: '6px' }}>(auto-calculated)</span>}
                    </td>
                    <td><StageBadge value={row.stade_actuel} /></td>
                    <td><NullableValue value={row.phase_annees} /></td>
                    <td><FormatRainfall value={row.pluviometrie_locale_mm} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
