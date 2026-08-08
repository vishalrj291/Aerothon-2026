import { motion } from 'framer-motion';

/**
 * RadialGauge – SVG-based animated radial gauge.
 * Props: value (0-100), size, label, sublabel, colorScheme
 */
export function RadialGauge({
  value = 0,
  size = 180,
  label = '',
  sublabel = '',
  colorScheme = 'auto', // 'auto' | 'blue' | 'success' | 'warning' | 'critical'
  strokeWidth = 10,
  animated = true,
  showValue = true,
}) {
  const radius    = (size - strokeWidth) / 2;
  const cx        = size / 2;
  const cy        = size / 2;
  // Arc spans 240 degrees (from -210deg to +30deg, i.e. bottom-left to bottom-right)
  const startAngle = -210;
  const endAngle   = 30;
  const totalArc   = endAngle - startAngle; // 240

  const toRad = (deg) => (deg * Math.PI) / 180;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (totalArc / 360) * circumference;

  const clampedValue = Math.max(0, Math.min(100, value));
  const fillPct = clampedValue / 100;
  const fillLength = fillPct * arcLength;
  const dashOffset = arcLength - fillLength;

  // Color based on value or override
  const getColor = () => {
    if (colorScheme === 'blue')     return '#3B82F6';
    if (colorScheme === 'success')  return '#22C55E';
    if (colorScheme === 'warning')  return '#FACC15';
    if (colorScheme === 'critical') return '#EF4444';
    // auto
    if (clampedValue >= 80) return '#22C55E';
    if (clampedValue >= 60) return '#FACC15';
    return '#EF4444';
  };

  const color = getColor();

  // SVG arc path helper
  const describeArc = (startDeg, endDeg) => {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  const trackPath = describeArc(startAngle, endAngle);

  const statusLabel = () => {
    if (clampedValue >= 80) return 'NOMINAL';
    if (clampedValue >= 60) return 'DEGRADED';
    return 'CRITICAL';
  };

  return (
    <div className="flex flex-col items-center gap-2" style={{ width: size }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Fill */}
          <motion.path
            d={trackPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={animated ? { duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 } : { duration: 0 }}
          />
          {/* Glow */}
          <motion.path
            d={trackPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 6}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={animated ? { duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 } : { duration: 0 }}
            style={{ opacity: 0.12, filter: 'blur(4px)' }}
          />
          {/* Value */}
          {showValue && (
            <>
              <text
                x={cx}
                y={cy - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={color}
                fontSize={size * 0.18}
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="700"
              >
                {Math.round(clampedValue)}
              </text>
              <text
                x={cx}
                y={cy + size * 0.12}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.3)"
                fontSize={size * 0.07}
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight="600"
                letterSpacing="2"
              >
                {sublabel || statusLabel()}
              </text>
            </>
          )}
        </svg>
      </div>
      {label && (
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--color-muted)',
          fontFamily: 'var(--font-display)',
          textAlign: 'center',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}
