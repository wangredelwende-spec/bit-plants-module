export default function KpiCard({ icon, value, label, variant = 'teal' }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
      <div className={`kpi-icon ${variant}`}>
        {icon}
      </div>
      <div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
      </div>
    </div>
  );
}
