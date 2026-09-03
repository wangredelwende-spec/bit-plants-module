export default function YieldComparisonBars({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 className="section-title font-heading" style={{ fontSize: '15px', margin: '24px 0 12px 0', color: 'var(--ink)' }}>
        Expected vs Actual Yield Comparison
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '14px' }}>
        {data.map((item) => {
          const expected = item.rendement_attendu_kg || 0;
          const actual = item.rendement_reel_kg;
          
          let percentage = 0;
          let labelText = '';
          let barColor = 'var(--green)'; // Default green
          
          if (actual === null || actual === undefined) {
            labelText = `${expected.toLocaleString()} kg (Awaiting harvest)`;
            barColor = 'var(--line)';
          } else {
            percentage = expected > 0 ? (actual / expected) * 100 : 0;
            labelText = `${actual.toLocaleString()} / ${expected.toLocaleString()} kg`;
            if (percentage < 80) barColor = 'var(--red)';
            else if (percentage < 95) barColor = 'var(--orange)';
          }
          
          return (
            <div key={item.id} className="card" style={{ padding: '14px 16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>
                {item.nom} (Block {item.bloc_parcelle})
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--muted)' }}>{labelText}</span>
                {actual != null && (
                  <span style={{ fontWeight: 700, color: barColor }}>
                    {percentage.toFixed(1)}%
                  </span>
                )}
              </div>
              <div style={{ height: '9px', borderRadius: '6px', background: '#eef2f1', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '6px', background: barColor, width: `${Math.min(percentage, 100)}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
