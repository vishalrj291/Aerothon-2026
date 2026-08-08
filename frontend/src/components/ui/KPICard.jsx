import { motion } from 'framer-motion';

/**
 * KPICard – large engineering metric card.
 * Props: label, value, unit, confidence, icon, trend, status
 */
export function KPICard({ label, value, unit = '', confidence, icon, status = 'nominal', delta, size = 'md' }) {
  const statusColor = {
    nominal:  '#3B82F6',
    healthy:  '#22C55E',
    warning:  '#FACC15',
    critical: '#EF4444',
  }[status] || '#3B82F6';

  const confColor = confidence >= 0.85 ? '#22C55E' : confidence >= 0.65 ? '#FACC15' : '#EF4444';
  const confLabel = confidence >= 0.85 ? 'HIGH' : confidence >= 0.65 ? 'MED' : 'LOW';

  return (
    <motion.div
      className="aero-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '16px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '3px', height: '100%',
        background: statusColor,
        borderRadius: '12px 0 0 12px',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, paddingLeft: 8 }}>
        <div className="aero-label" style={{ color: 'var(--color-muted)' }}>{label}</div>
        {icon && (
          <div style={{ color: statusColor, opacity: 0.8, fontSize: 16, display: 'flex' }}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: size === 'lg' ? 36 : 28,
            fontWeight: 700,
            color: statusColor,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            {typeof value === 'number' ? value.toFixed(value > 100 ? 0 : 2) : (value ?? '—')}
          </span>
          {unit && (
            <span style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>
              {unit}
            </span>
          )}
        </div>

        {/* Confidence */}
        {confidence !== undefined && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 9, color: 'var(--color-dim)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                CONFIDENCE
              </span>
              <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: confColor, fontWeight: 700 }}>
                {(confidence * 100).toFixed(1)}% · {confLabel}
              </span>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                style={{ background: confColor, width: `${confidence * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Delta */}
        {delta !== undefined && (
          <div style={{ marginTop: 6, fontSize: 11, color: delta >= 0 ? '#22C55E' : '#EF4444', fontFamily: 'var(--font-mono)' }}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
