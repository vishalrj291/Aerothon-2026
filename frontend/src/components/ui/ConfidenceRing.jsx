/**
 * ConfidenceRing.jsx – Light-theme versions of confidence indicators.
 * Used in RightPanel and other new components.
 */

// ── Confidence Bar (horizontal) ───────────────────────────────
export function ConfidenceBar({ value, label, showLabel = true }) {
  const pct   = value != null ? (value <= 1 ? value * 100 : value) : 0;
  const color = pct >= 85 ? '#22C55E' : pct >= 70 ? '#F59E0B' : '#EF4444';

  return (
    <div>
      {showLabel && label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>{pct.toFixed(1)}%</span>
        </div>
      )}
      <div style={{ height: 4, background: '#F1F5F9', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 100, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

// ── Confidence Ring (SVG donut) ───────────────────────────────
export function ConfidenceRing({ value, size = 60, label }) {
  const pct  = value != null ? (value <= 1 ? value * 100 : value) : 0;
  const r    = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color= pct >= 85 ? '#22C55E' : pct >= 70 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={5} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: size * 0.22, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fill: color }}>
          {Math.round(pct)}
        </text>
      </svg>
      {label && <span style={{ fontSize: 10, color: '#64748B', textAlign: 'center' }}>{label}</span>}
    </div>
  );
}
