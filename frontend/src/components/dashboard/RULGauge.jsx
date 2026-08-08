import { RUL_DATA } from '../../data/sampleData';

// ── Arc math helpers ──────────────────────────────────────────
function polarToXY(cx, cy, r, angleDeg) {
  const rad = angleDeg * Math.PI / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad), // SVG Y inverted
  };
}

// Describe a counter-clockwise arc from startDeg to endDeg (both in standard math degrees)
// 180=left, 90=top, 0=right
function describeArc(cx, cy, r, startDeg, endDeg) {
  const start = polarToXY(cx, cy, r, startDeg);
  const end   = polarToXY(cx, cy, r, endDeg);
  const sweep = 0; // counter-clockwise in SVG (which appears clockwise visually)
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export function RULGauge({ rulData }) {
  const data = { ...RUL_DATA, ...rulData };
  const { current, remaining, max, threshold, predictedFailure } = data;

  const cx = 160, cy = 160, ro = 130, ri = 100;
  const valueAngle  = 180 - (remaining / max) * 180;       // needle angle
  const threshAngle = 180 - (threshold / max) * 180;
  const predAngle   = 180 - (predictedFailure / max) * 180;

  // Needle tip
  const needleTip  = polarToXY(cx, cy, ro - 15, valueAngle);
  const needleBase = polarToXY(cx, cy, 18,       valueAngle);

  // Zone colors: red 0→threshold, yellow threshold→40%, green 40%→100%
  const safeAngle = 180 - 0.4 * 180; // 40%
  const pctRemain = (remaining / max) * 100;
  const mainColor = pctRemain > 40 ? '#22C55E' : pctRemain > (threshold/max)*100 ? '#F59E0B' : '#EF4444';

  return (
    <div className="ae-card" style={{ padding: '20px 22px' }}>
      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Remaining Useful Life</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>RUL Prognostics · Physics-guided estimation</div>
      </div>

      {/* SVG gauge */}
      <svg viewBox="0 0 320 190" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>

        {/* Background track */}
        <path
          d={describeArc(cx, cy, (ro+ri)/2, 180, 0)}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={ro - ri}
          strokeLinecap="round"
        />

        {/* Red zone: 0→threshold */}
        <path
          d={describeArc(cx, cy, (ro+ri)/2, 180, threshAngle)}
          fill="none"
          stroke="#FECACA"
          strokeWidth={ro - ri - 2}
          strokeLinecap="round"
        />

        {/* Yellow zone: threshold→40% */}
        <path
          d={describeArc(cx, cy, (ro+ri)/2, threshAngle, safeAngle)}
          fill="none"
          stroke="#FDE68A"
          strokeWidth={ro - ri - 2}
          strokeLinecap="round"
        />

        {/* Green zone: 40%→100% */}
        <path
          d={describeArc(cx, cy, (ro+ri)/2, safeAngle, 0)}
          fill="none"
          stroke="#BBF7D0"
          strokeWidth={ro - ri - 2}
          strokeLinecap="round"
        />

        {/* Active fill (remaining portion) */}
        {remaining > 0 && (
          <path
            d={describeArc(cx, cy, (ro+ri)/2, 180, valueAngle)}
            fill="none"
            stroke={mainColor}
            strokeWidth={ro - ri - 8}
            strokeLinecap="round"
            style={{ transition: 'all 0.8s ease' }}
          />
        )}

        {/* Threshold marker */}
        <line
          x1={polarToXY(cx, cy, ri - 2, threshAngle).x}
          y1={polarToXY(cx, cy, ri - 2, threshAngle).y}
          x2={polarToXY(cx, cy, ro + 2, threshAngle).x}
          y2={polarToXY(cx, cy, ro + 2, threshAngle).y}
          stroke="#EF4444" strokeWidth={2} strokeLinecap="round"
        />

        {/* Scale ticks */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const deg = 180 - (pct / 100) * 180;
          const outer = polarToXY(cx, cy, ro + 8, deg);
          const inner = polarToXY(cx, cy, ro + 2, deg);
          const labelPt = polarToXY(cx, cy, ro + 18, deg);
          return (
            <g key={pct}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#CBD5E1" strokeWidth={1.5} />
              <text x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
                {Math.round(pct / 100 * max)}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <line
          x1={needleBase.x} y1={needleBase.y}
          x2={needleTip.x}  y2={needleTip.y}
          stroke="#1E293B" strokeWidth={3} strokeLinecap="round"
          style={{ transition: 'all 0.8s ease' }}
        />
        <circle cx={cx} cy={cy} r={8} fill="#1E293B" />
        <circle cx={cx} cy={cy} r={4} fill="#fff" />

        {/* Center value */}
        <text x={cx} y={cy + 28} textAnchor="middle" style={{ fontSize: 36, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fill: mainColor }}>
          {remaining}
        </text>
        <text x={cx} y={cy + 46} textAnchor="middle" style={{ fontSize: 11, fill: '#64748B', fontFamily: 'Inter, sans-serif' }}>
          cycles remaining
        </text>

        {/* Zone labels */}
        <text x={28} y={cy + 8} textAnchor="start" style={{ fontSize: 9, fill: '#EF4444', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>CRITICAL</text>
        <text x={cx * 2 - 28} y={cy + 8} textAnchor="end" style={{ fontSize: 9, fill: '#22C55E', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>NOMINAL</text>
      </svg>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
        {[
          { label: 'Failure Threshold', value: `≤ ${threshold}`, unit: 'cyc', color: '#EF4444' },
          { label: 'Pred. Failure At',  value: predictedFailure, unit: 'cyc', color: '#F59E0B' },
          { label: 'Current Cycle',     value: current,           unit: 'cyc', color: '#2563EB' },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center', padding: '8px 6px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
            <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 16, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: '#94A3B8' }}>{s.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
