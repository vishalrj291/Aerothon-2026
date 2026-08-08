import { motion } from 'framer-motion';

/**
 * Loader – professional aerospace-style loading indicator.
 */
export function Loader({ size = 40, label = '' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        {/* Outer ring */}
        <circle cx={20} cy={20} r={17} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        {/* Spinning arc */}
        <motion.circle
          cx={20} cy={20} r={17}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="40 67"
          style={{ transformOrigin: 'center' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner dot */}
        <motion.circle
          cx={20} cy={20} r={3}
          fill="#3B82F6"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
      {label && (
        <div style={{
          fontSize: 10,
          color: 'var(--color-muted)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

/**
 * PageLoader – full-height loading state for pages.
 */
export function PageLoader({ label = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      gap: 20,
    }}>
      <Loader size={52} />
      <div style={{
        fontSize: 12,
        color: 'var(--color-muted)',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  );
}

/**
 * SkeletonBlock – loading placeholder.
 */
export function SkeletonBlock({ width = '100%', height = 20, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 6, ...style }}
    />
  );
}
