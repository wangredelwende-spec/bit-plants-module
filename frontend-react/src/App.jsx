import { useState, useEffect, useCallback } from 'react';
import { fetchVarieties } from './api/varieties.js';
import AppHeader from './components/AppHeader.jsx';
import AppNav from './components/AppNav.jsx';
import FilterBar from './components/FilterBar.jsx';
import VarietiesTable from './components/VarietiesTable.jsx';
import VarietyModal from './components/VarietyModal.jsx';
import { LoadingState, ErrorState, EmptyState } from './components/StateMessages.jsx';

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
export default function App() {
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
    <>
      <title>Plants Module — Variety Management</title>
      <div className="app-shell">
        <AppHeader />
        <div className="app-layout">
          <AppNav />
          <main className="main-content">
            <div className="page-header">
              <h1 className="page-header__title">Variety Management</h1>
              <p className="page-header__subtitle">
                Task 1 — Track and manage mango variety selections across farm blocks
              </p>
            </div>

            <FilterBar
              blocs={blocs}
              selectedBloc={selectedBloc}
              onBlocChange={handleBlocChange}
              onClear={handleClearFilter}
            />

            <section id="table-section" className="fade-in">
              {status === 'loading' && <LoadingState />}
              {status === 'error'   && <ErrorState message={errorMsg} onRetry={handleRetry} />}
              {status === 'empty'   && <EmptyState />}
              {status === 'ok'      && (
                <VarietiesTable
                  data={varieties}
                  onRowClick={(id) => setSelectedVarietyId(id)}
                />
              )}
            </section>
          </main>
        </div>
      </div>

      <VarietyModal
        varietyId={selectedVarietyId}
        onClose={() => setSelectedVarietyId(null)}
      />
    </>
  );
}
