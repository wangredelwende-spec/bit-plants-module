/**
 * State message components — Loading, Error (with Retry button), Empty.
 * Mirror the renderLoading / renderError / renderEmpty functions from frontend/app.js.
 */

export function LoadingState({ message = 'Loading data…' }) {
  return (
    <div className="loading">
      <div className="spinner" />
      <span className="loading__text">{message}</span>
    </div>
  );
}

/**
 * Error state with explicit message and Retry button.
 * onRetry re-triggers the data fetch — never leaves user on blank screen.
 */
export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-message state-message--error">
      <span className="state-message__icon">⚠</span>
      <span className="state-message__title">Unable to load data</span>
      <span className="state-message__text">{message}</span>
      <button id="btn-retry" className="state-message__btn" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function EmptyState({ title = 'No data found', message = 'No records match the current filter.' }) {
  return (
    <div className="state-message state-message--empty">
      <span className="state-message__icon">📭</span>
      <span className="state-message__title">{title}</span>
      <span className="state-message__text">{message}</span>
    </div>
  );
}
