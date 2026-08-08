import { motion } from 'framer-motion';

/**
 * EngineerSlider – an engineering-grade slider with labeled range limits.
 * Props: label, name, value, min, max, step, unit, onChange, limits
 *
 * limits: { warning: number, critical: number } — values from min where zones begin
 * e.g. limits = { warning: 0.8, critical: 0.95 } means:
 *   0-80% of range = normal, 80-95% = warning, 95-100% = critical
 */
export function EngineerSlider({
  label, name, value, min = 0, max = 100, step = 1,
  unit = '', onChange, limits,
}) {
  const range = max - min;
  const pct = (value - min) / range;

  // Determine zone
  let zone = 'normal';
  if (limits) {
    const warnThreshold = min + range * limits.warning;
    const critThreshold = min + range * limits.critical;
    if (value >= critThreshold) zone = 'critical';
    else if (value >= warnThreshold) zone = 'warning';
  }

  const zoneColor = zone === 'critical' ? '#EF4444' : zone === 'warning' ? '#FACC15' : '#22C55E';
  const zoneBg    = zone === 'critical' ? 'rgba(239,68,68,0.12)'  : zone === 'warning' ? 'rgba(250,204,21,0.12)'  : 'rgba(34,197,94,0.08)';

  return (
    <div style={{ width: '100%' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Zone badge */}
          <span style={{
            fontSize: 8,
            fontWeight: 700,
            color: zoneColor,
            background: zoneBg,
            border: `1px solid ${zoneColor}40`,
            borderRadius: 100,
            padding: '1px 5px',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {zone}
          </span>
          {/* Value display */}
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: zoneColor,
            fontFamily: 'var(--font-mono)',
            minWidth: 60,
            textAlign: 'right',
          }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span style={{ fontSize: 9, color: 'var(--color-dim)', marginLeft: 2 }}>{unit}</span>}
          </span>
        </div>
      </div>

      {/* Track with zone markers */}
      <div style={{ position: 'relative', marginBottom: 4 }}>
        {/* Track background with zones */}
        <div style={{ position: 'relative', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          {limits && (
            <>
              {/* Warning zone */}
              <div style={{
                position: 'absolute',
                left: `${limits.warning * 100}%`,
                width: `${(limits.critical - limits.warning) * 100}%`,
                height: '100%',
                background: 'rgba(250,204,21,0.15)',
              }} />
              {/* Critical zone */}
              <div style={{
                position: 'absolute',
                left: `${limits.critical * 100}%`,
                width: `${(1 - limits.critical) * 100}%`,
                height: '100%',
                background: 'rgba(239,68,68,0.15)',
              }} />
            </>
          )}
          {/* Fill */}
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              height: '100%',
              borderRadius: 2,
              background: zoneColor,
              width: `${pct * 100}%`,
            }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Slider input */}
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className={`eng-slider eng-slider-${zone}`}
          style={{ position: 'absolute', top: '50%', left: 0, width: '100%', transform: 'translateY(-50%)', margin: 0, opacity: 0, height: 20, cursor: 'pointer' }}
        />
      </div>

      {/* Min / Max labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 8, color: 'var(--color-dim)', fontFamily: 'var(--font-mono)' }}>
          {min.toLocaleString()}{unit}
        </span>
        {limits && (
          <span style={{ fontSize: 8, color: 'var(--color-dim)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>
            |←SAFE→|←WARN→|←CRIT→|
          </span>
        )}
        <span style={{ fontSize: 8, color: 'var(--color-dim)', fontFamily: 'var(--font-mono)' }}>
          {max.toLocaleString()}{unit}
        </span>
      </div>
    </div>
  );
}
