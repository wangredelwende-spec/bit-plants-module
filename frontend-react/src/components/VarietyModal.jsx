import { useEffect, useState } from 'react';
import { fetchVarietyById } from '../api/varieties.js';
import {
  NullableValue,
  FormatNumber,
  FormatDate,
  FormatBloc,
  VigorBadge,
} from './formatters.jsx';

/**
 * Variety detail modal.
 * Opens when varietyId is set; closes via onClose.
 * Fields mirror the modal in frontend/app.js openDetailModal() exactly.
 */
export default function VarietyModal({ varietyId, onClose }) {
  const [variety, setVariety] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isOpen = varietyId !== null;

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setVariety(null);
    setError(null);

    fetchVarietyById(varietyId)
      .then((data) => { setVariety(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [varietyId, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      id="modal-overlay"
      className={`modal-overlay${isOpen ? ' active' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" role="dialog" aria-labelledby="modal-title">
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {loading ? 'Loading…' : variety ? variety.nom : 'Variety Details'}
          </h2>
          <button
            id="modal-close"
            className="modal__close"
            aria-label="Close"
            type="button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="modal__grid" id="modal-body">
          {loading && (
            <div className="loading" style={{ gridColumn: '1/-1' }}>
              <div className="spinner" />
            </div>
          )}

          {error && (
            <div className="state-message state-message--error" style={{ gridColumn: '1/-1' }}>
              <span className="state-message__icon">⚠</span>
              <span className="state-message__text">{error}</span>
            </div>
          )}

          {variety && (
            <>
              <Field label="Name">{variety.nom}</Field>
              <Field label="Farm ID"><NullableValue value={variety.id_ferme} /></Field>
              <Field label="Number of Trees"><FormatNumber value={variety.nombre_arbres} /></Field>
              <Field label="Inter-row Spacing (m)"><NullableValue value={variety.espacement_inter_rang_m} /></Field>
              <Field label="Intra-row Spacing (m)"><NullableValue value={variety.espacement_intra_rang_m} /></Field>
              <Field label="Density (trees/ha)"><FormatNumber value={variety.densite_arbres_ha} /></Field>
              <Field label="Expected Yield (kg)"><FormatNumber value={variety.rendement_attendu_kg} /></Field>
              <Field label="Actual Yield (kg)"><FormatNumber value={variety.rendement_reel_kg} /></Field>
              <Field label="Vigor"><VigorBadge value={variety.vigueur} /></Field>
              <Field label="Block"><FormatBloc value={variety.bloc_parcelle} /></Field>
              <Field label="Plant Origin"><NullableValue value={variety.origine_plant} /></Field>
              <Field label="Source"><NullableValue value={variety.source} /></Field>
              <Field label="Last Updated"><FormatDate value={variety.date_maj} /></Field>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="modal__field">
      <div className="modal__field-label">{label}</div>
      <div className="modal__field-value">{children}</div>
    </div>
  );
}
