/**
 * StatusBadge – online/offline/warning inline badge.
 */
export function StatusBadge({ status = 'unknown', label, pulse = false }) {
  const cfg = {
    online:   { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  dot: '#22C55E', text: '#22C55E' },
    healthy:  { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  dot: '#22C55E', text: '#22C55E' },
    offline:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  dot: '#EF4444', text: '#EF4444' },
    warning:  { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.3)', dot: '#FACC15', text: '#FACC15' },
    loading:  { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', dot: '#3B82F6', text: '#3B82F6' },
    unknown:  { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)',dot: '#94A3B8', text: '#94A3B8' },
  }[status] || { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', dot: '#94A3B8', text: '#94A3B8' };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 8px',
      borderRadius: 100,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      fontSize: 10,
      fontWeight: 700,
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: cfg.text,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: cfg.dot,
        flexShrink: 0,
        ...(pulse ? { animation: 'blink 1.5s ease-in-out infinite' } : {}),
      }} />
      {label || status.toUpperCase()}
    </span>
  );
}
