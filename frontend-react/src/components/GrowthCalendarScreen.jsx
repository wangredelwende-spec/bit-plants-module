import { useState, useEffect, useCallback } from 'react';
import { fetchGrowthCalendar } from '../api/growthCalendar.js';
import { fetchVarieties } from '../api/varieties.js';
import FilterBar from './FilterBar.jsx';
import { LoadingState, ErrorState, EmptyState } from './StateMessages.jsx';
import { NullableValue, FormatDate, FormatBloc } from './formatters.jsx';
import AppHeader from './AppHeader.jsx';
import KpiCard from './KpiCard.jsx';

/**
 * Stage Badge with color coding based on provisional values.
 */
function StageBadge({ value }) {
  if (!value) return <span className="null-value">—</span>;
  const valLower = value.toLowerCase();
  let cls = 'gray';
  if (valLower === 'production') cls = 'green';
  else if (valLower === 'croissance' || valLower === 'growth') cls = 'orange';
  
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

export default function GrowthCalendarScreen({ onHome }) {
  const [entries, setEntries] = useState([]);
  const [blocs, setBlocs] = useState([]);          
  const [selectedBloc, setSelectedBloc] = useState('');
  const [status, setStatus] = useState('loading'); 
  const [errorMsg, setErrorMsg] = useState('');
  // const [selectedEntryId, setSelectedEntryId] = useState(null); // Detail modal not strictly spec'd in mockup for this screen, but could add if needed. Keeping it simple for now as requested.

  const loadData = useCallback(async (bloc) => {
    setStatus('loading');
    let calendarErrorMsg = '';
    try {
      const params = {};
      if (bloc) params.bloc_parcelle = bloc;

      let calendarData = [];
      try {
        calendarData = await fetchGrowthCalendar(params);
      } catch (err) {
        calendarErrorMsg = err.message.includes('Failed to fetch') || err.message.includes('NetworkError')
          ? 'Unable to reach the backend server (Growth Calendar)'
          : err.message;
        throw new Error(calendarErrorMsg);
      }

      let varietiesData = [];
      try {
        varietiesData = await fetchVarieties(params);
      } catch (err) {
        console.warn('Failed to fetch varieties data:', err);
        // API failure for varieties is gracefully handled (variety_name will be null)
      }

      if (!bloc) {
        const uniqueBlocs = [...new Set(calendarData.map((r) => r.bloc_parcelle).filter(Boolean))].sort();
        setBlocs(uniqueBlocs);
      }

      const enrichedData = calendarData.map(entry => {
        const matchingVariety = varietiesData.find(v => v.bloc_parcelle === entry.bloc_parcelle);
        return {
          ...entry,
          variety_name: matchingVariety ? matchingVariety.nom : null
        };
      });

      setEntries(enrichedData);
      setStatus(enrichedData.length === 0 ? 'empty' : 'ok');
    } catch (err) {
      setErrorMsg(calendarErrorMsg || err.message);
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
      <AppHeader 
        eyebrow="Task 2" 
        title="Planting Calendar & Growth Stages" 
        description="Age is auto-calculated from planting date, never entered manually."
        onHome={onHome}
      />

      {/*
        KNOWN DISCREPANCIES vs mockup (Partie B.2 — flagged, not auto-corrected):
        1. This 4-card KPI row (Calendar Entries / In Production / In Growth / Avg. Tree Age)
           does NOT exist on the Growth Calendar screen in mockup/index.html (screen-growth
           only has: header, filter bar, one table). Same discrepancy pattern as Varieties.
        2. The "Growth Phases" timeline section below is also absent from the mockup for this
           screen. This was already identified and deliberately kept as-is in a prior pass
           (see implementation_plan.md, Task 2 section) — documenting again here per instructions,
           not removing without a fresh decision.
      */}
      {status === 'ok' && entries.length > 0 && (() => {
        const totalEntries = entries.length;
        const productionCount = entries.filter(e => e.stade_actuel && e.stade_actuel.toLowerCase() === 'production').length;
        const growthCount = entries.filter(e => e.stade_actuel && (e.stade_actuel.toLowerCase() === 'croissance' || e.stade_actuel.toLowerCase() === 'growth')).length;
        const avgAge = entries.reduce((s, e) => s + (e.tree_age_years || 0), 0) / totalEntries;
        return (
          <div className="kpi-cards">
            <KpiCard
              variant="teal"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
              value={totalEntries}
              label="Calendar Entries"
            />
            <KpiCard
              variant="green"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
              value={productionCount}
              label="In Production"
            />
            <KpiCard
              variant="orange"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
              value={growthCount}
              label="In Growth"
            />
            <KpiCard
              variant="teal"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              value={avgAge > 0 ? `${avgAge.toFixed(1)} yr` : '—'}
              label="Avg. Tree Age"
            />
          </div>
        );
      })()}

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
                  <th>Variety</th>
                  <th>Planting Date</th>
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
                    <td><NullableValue value={row.variety_name} /></td>
                    <td><FormatDate value={row.date_plantation} /></td>
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
