export default function YieldOverviewCharts({ data }) {
  if (!data || data.length === 0) return null;

  // Calculate values for Donut chart
  let totalExpected = 0;
  let totalActual = 0;
  let blocksHarvested = 0;

  data.forEach(item => {
    if (item.rendement_attendu_kg) totalExpected += item.rendement_attendu_kg;
    if (item.rendement_reel_kg != null) {
      totalActual += item.rendement_reel_kg;
      blocksHarvested += 1;
    }
  });

  let avgYieldAchieved = 0;
  if (blocksHarvested > 0) {
    const expectedForHarvested = data.reduce((acc, curr) => acc + (curr.rendement_reel_kg != null ? (curr.rendement_attendu_kg || 0) : 0), 0);
    if (expectedForHarvested > 0) {
      avgYieldAchieved = (totalActual / expectedForHarvested) * 100;
    }
  }
  
  const displayPercentage = blocksHarvested > 0 && !isNaN(avgYieldAchieved) ? avgYieldAchieved.toFixed(1) : '0.0';

  // Calculate values for Bar chart
  const maxYield = Math.max(
    1,
    ...data.map(d => Math.max(d.rendement_attendu_kg || 0, d.rendement_reel_kg || 0))
  );
  
  const MAX_BAR_HEIGHT = 130;
  const BASE_Y = 150;
  const viewBoxWidth = Math.max(340, 20 + data.length * 84);

  // SVG calculations for donut
  const radius = 60;
  const circumference = 2 * Math.PI * radius; // approx 377
  const strokeDashoffset = circumference - (Number(displayPercentage) / 100) * circumference;

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 className="section-title font-heading" style={{ fontSize: '15px', margin: '24px 0 12px 0', color: 'var(--ink)' }}>
        Yield Overview by Block
      </h3>
      <div className="card">
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <svg viewBox={`0 0 ${viewBoxWidth} 170`} width="100%" style={{ maxWidth: `${viewBoxWidth}px` }}>
            <line x1="10" y1="150" x2={viewBoxWidth - 10} y2="150" stroke="#dfe7e5" strokeWidth="1"/>
            
            {data.map((item, index) => {
              const expected = item.rendement_attendu_kg || 0;
              const actual = item.rendement_reel_kg;
              const isAwaiting = actual === null || actual === undefined;
              
              const expectedHeight = (expected / maxYield) * MAX_BAR_HEIGHT;
              const expectedY = BASE_Y - expectedHeight;
              
              let actualHeight = 0;
              let actualY = BASE_Y;
              
              if (!isAwaiting) {
                actualHeight = (actual / maxYield) * MAX_BAR_HEIGHT;
                actualY = BASE_Y - actualHeight;
              } else {
                actualHeight = expectedHeight;
                actualY = expectedY;
              }

              const startX = 20 + index * 84;
              
              return (
                <g key={`block-${index}`}>
                  <rect x={startX} y={expectedY} width="20" height={expectedHeight} rx="3" fill="var(--orange)"/>
                  {isAwaiting ? (
                    <rect x={startX + 24} y={actualY} width="20" height={actualHeight} rx="3" fill="none" stroke="var(--gray-300)" strokeWidth="2" strokeDasharray="3 3"/>
                  ) : (
                    <rect x={startX + 24} y={actualY} width="20" height={actualHeight} rx="3" fill="var(--primary)"/>
                  )}
                  <text x={startX + 22} y="164" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#5b6b66">
                    {`Block ${item.bloc_parcelle}`}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="donut-wrap" style={{ flex: 1, minWidth: '150px' }}>
            <svg viewBox="0 0 160 160" width="130" height="130">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#eef2f1" strokeWidth="20"/>
              <circle 
                cx="80" cy="80" r="60" fill="none" stroke="var(--green)" strokeWidth="20"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 80 80)"
              />
              <text x="80" y="76" textAnchor="middle" fontFamily="IBM Plex Sans" fontWeight="700" fontSize="22" fill="#16241f">
                {displayPercentage}%
              </text>
              <text x="80" y="96" textAnchor="middle" fontFamily="Inter" fontWeight="500" fontSize="10" fill="#5b6b66">
                avg. yield achieved
              </text>
            </svg>
          </div>
        </div>

        <div className="legend-row" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--muted)', fontWeight: 500, flexWrap: 'wrap' }}>
          <span><span className="legend-dot" style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '2px', marginRight: '5px', background: 'var(--orange)' }}></span>Expected Yield</span>
          <span><span className="legend-dot" style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '2px', marginRight: '5px', background: 'var(--primary)' }}></span>Actual Yield</span>
          <span><span className="legend-dot" style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '2px', marginRight: '5px', background: 'var(--gray-300)' }}></span>Awaiting Harvest</span>
        </div>
      </div>
    </div>
  );
}
