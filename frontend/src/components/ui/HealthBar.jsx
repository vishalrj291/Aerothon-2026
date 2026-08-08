import { motion } from 'framer-motion';

/**
 * HealthBar – animated horizontal health bar with label and degradation shading.
 * Props: label, value (0-100), confidence (0-1), sublabel
 */
export function HealthBar({ label, value = 0, confidence, sublabel, showConf = true, delay = 0 }) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const color = clampedValue >= 80 ? '#22C55E' : clampedValue >= 60 ? '#FACC15' : '#EF4444';
  const statusText = clampedValue >= 80 ? 'NOMINAL' : clampedValue >= 60 ? 'DEGRADED' : 'CRITICAL';

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {label}
          </span>
          {sublabel && (
            <span style={{ fontSize: 9, color: 'var(--color-dim)', fontFamily: 'var(--font-display)' }}>
              {sublabel}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showConf && confidence !== undefined && (
            <span style={{ fontSize: 9, color: 'var(--color-dim)', fontFamily: 'var(--font-mono)' }}>
              {(confidence * 100).toFixed(0)}% conf
            </span>
          )}
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            color,
            fontFamily: 'var(--font-mono)',
          }}>
            {clampedValue.toFixed(1)}
          </span>
          <span style={{ fontSize: 8, color, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.08em' }}>
            {statusText}
          </span>
        </div>
      </div>
      {/* Track */}
      <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
        {/* Danger zone overlay */}
        <div style={{
          position: 'absolute',
          right: 0, top: 0, height: '100%',
          width: '20%',
          background: 'rgba(239,68,68,0.06)',
        }} />
        {/* Warning zone overlay */}
        <div style={{
          position: 'absolute',
          right: '20%', top: 0, height: '100%',
          width: '20%',
          background: 'rgba(250,204,21,0.04)',
        }} />
        {/* Fill */}
        <motion.div
          style={{
            height: '100%',
            background: color,
            borderRadius: 4,
            boxShadow: `0 0 8px ${color}50`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay }}
        />
      </div>
    </div>
  );
}
