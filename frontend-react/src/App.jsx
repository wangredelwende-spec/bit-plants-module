import { useState, useEffect, useCallback } from 'react';
import { fetchVarieties } from './api/varieties.js';
import AppHeader from './components/AppHeader.jsx';
import AppNav from './components/AppNav.jsx';
import FilterBar from './components/FilterBar.jsx';
import VarietiesTable from './components/VarietiesTable.jsx';
import VarietyModal from './components/VarietyModal.jsx';
import GrowthCalendarScreen from './components/GrowthCalendarScreen.jsx';
import FertilizerInventoryScreen from './components/FertilizerInventoryScreen.jsx';
import { LoadingState, ErrorState, EmptyState } from './components/StateMessages.jsx';
import YieldOverviewCharts from './components/YieldOverviewCharts.jsx';
import YieldComparisonBars from './components/YieldComparisonBars.jsx';
import KpiCard from './components/KpiCard.jsx';

/**
 * Plants Module — React App (Task 1: Varieties)
 *
 * State machine:
 *   loading → data (table) | error (banner+retry) | empty (no results)
 *   row click → modal (detail fetch inside modal)
 *
 * Design decisions inherited from frontend/app.js:
 * - Filter sends raw bloc value to API (?bloc_parcelle=A)
 * - Display prefixes "Block " only in UI labels
 * - NULL fields → '—' via formatter components
 * - Network error → ErrorState with Retry button (never blank screen)
 */
// ---------------------------------------------------------------
// Home button handler (Partie A.1 / B.1 of the alignment brief).
// In the mockup, every screen's Home button calls navigateTo('overview').
// The React app does not implement an Overview screen yet (see AppNav.jsx —
// 'overview' is still marked disabled). Per the brief, this is therefore an
// intentional, documented no-op until Overview exists in React; do not wire
// it to anything else without re-checking the brief's instruction first.
// ---------------------------------------------------------------
function handleHomeClick() {
  // no-op — Overview screen not implemented in React yet
}

function VarietiesScreen() {
  const [varieties, setVarieties] = useState([]);
  const [blocs, setBlocs] = useState([]);          // unique bloc values for dropdown
  const [selectedBloc, setSelectedBloc] = useState('');
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'error' | 'empty'
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedVarietyId, setSelectedVarietyId] = useState(null);

  const loadData = useCallback(async (bloc) => {
    setStatus('loading');
    try {
      const params = {};
      if (bloc) params.bloc_parcelle = bloc;

      const data = await fetchVarieties(params);

      // When unfiltered, extract unique blocs for the dropdown
      if (!bloc) {
        const uniqueBlocs = [...new Set(data.map((r) => r.bloc_parcelle).filter(Boolean))].sort();
        setBlocs(uniqueBlocs);
      }

      setVarieties(data);
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

  // Initial load
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
        eyebrow="Task 1" 
        title="Varieties" 
        description="Trees, spacing, and expected vs actual yield by variety and block."
        onHome={handleHomeClick}
      />

      {/*
        KNOWN DISCREPANCY vs mockup (Partie A.2 — flagged, not auto-corrected per brief):
        This 4-card KPI row (Total Trees / Expected Yield / Actual Yield / Farm Blocks) does
        NOT exist on the Varieties screen in mockup/index.html — the mockup only shows a KPI
        row on the Overview screen (screen-overview, different cards: Total Plants, In Growth
        Stage, Ready for Harvest, Active Alerts, Avg. Health Score). Left in place pending an
        explicit decision from the team; see final report.
      */}
      {status === 'ok' && varieties.length > 0 && (() => {
        const totalTrees = varieties.reduce((s, v) => s + (v.nombre_arbres || 0), 0);
        const totalExpected = varieties.reduce((s, v) => s + (v.rendement_attendu_kg || 0), 0);
        const totalActual = varieties.reduce((s, v) => s + (v.rendement_reel_kg || 0), 0);
        const uniqueBlocs = new Set(varieties.map(v => v.bloc_parcelle).filter(Boolean)).size;
        return (
          <div className="kpi-cards">
            <KpiCard
              variant="teal"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
              value={totalTrees.toLocaleString()}
              label="Total Trees"
            />
            <KpiCard
              variant="green"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
              value={`${(totalExpected / 1000).toFixed(1)} t`}
              label="Expected Yield"
            />
            <KpiCard
              variant="orange"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M20.7 11A10 10 0 0 0 13 3.3V11h7.7z"/></svg>}
              value={totalActual > 0 ? `${(totalActual / 1000).toFixed(1)} t` : '—'}
              label="Actual Yield"
            />
            <KpiCard
              variant="teal"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
              value={uniqueBlocs}
              label="Farm Blocks"
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

      <section id="table-section" className="fade-in">
        {status === 'loading' && <LoadingState message="Loading variety data…" />}
        {status === 'error'   && <ErrorState message={errorMsg} onRetry={handleRetry} />}
        {status === 'empty'   && <EmptyState title="No varieties found" message="No variety records match the current filter. Try selecting a different block or clearing the filter." />}
        {status === 'ok'      && (
          <>
            <VarietiesTable
              data={varieties}
              onRowClick={(id) => setSelectedVarietyId(id)}
            />
            <YieldOverviewCharts data={varieties} />
            <YieldComparisonBars data={varieties} />
          </>
        )}
      </section>

      <VarietyModal
        varietyId={selectedVarietyId}
        onClose={() => setSelectedVarietyId(null)}
      />
    </main>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('varieties');

  return (
    <>
      <title>Plants Module</title>
      <div className="app-shell">
        <div className="app-layout">
          <AppNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
          {currentScreen === 'varieties' && <VarietiesScreen />}
          {currentScreen === 'calendar' && <GrowthCalendarScreen onHome={handleHomeClick} />}
          {currentScreen === 'fertilizers' && <FertilizerInventoryScreen onHome={handleHomeClick} />}
        </div>
      </div>
    </>
  );
}
