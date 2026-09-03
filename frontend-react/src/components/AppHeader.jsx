/**
 * AppHeader — Screen header matching mockup structure:
 *   - eyebrow: small grey uppercase label (e.g. "TASK 1")
 *   - title: large black IBM Plex Sans heading
 *   - description: grey description text below
 *   - Home button (top-right, .btn.btn--home in the mockup) — present on every
 *     screen-header in mockup/index.html. Rendered whenever onHome is passed.
 * White background, no gradient, matching .screen-header from mockup.
 */
export default function AppHeader({ eyebrow, title, description, onHome }) {
  return (
    <div className="screen-header">
      <div>
        {eyebrow && <p className="screen-eyebrow">{eyebrow}</p>}
        <h2 className="screen-title font-heading">{title}</h2>
        {description && <p className="screen-desc">{description}</p>}
      </div>
      {onHome && (
        <button type="button" className="btn btn--home" onClick={onHome}>
          Home
        </button>
      )}
    </div>
  );
}
