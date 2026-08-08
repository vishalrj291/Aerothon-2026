import { AlertTriangle, WifiOff, ServerOff, FileX, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const ERROR_TYPES = {
  network:    { icon: WifiOff,    color: '#EF4444', title: 'CONNECTION LOST',      sub: 'Backend server is unreachable.' },
  offline:    { icon: ServerOff,  color: '#EF4444', title: 'BACKEND OFFLINE',      sub: 'Start the FastAPI server at http://127.0.0.1:8000' },
  csv:        { icon: FileX,      color: '#FACC15', title: 'INVALID CSV FORMAT',   sub: 'Ensure your CSV matches the required schema.' },
  prediction: { icon: Cpu,        color: '#EF4444', title: 'PREDICTION FAILED',    sub: 'An error occurred during model inference.' },
  generic:    { icon: AlertTriangle, color: '#FACC15', title: 'ERROR',             sub: '' },
};

/**
 * ErrorBanner – inline error notification.
 */
export function ErrorBanner({ message, type = 'generic', onDismiss }) {
  const cfg = ERROR_TYPES[type] || ERROR_TYPES.generic;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 14px',
        background: `rgba(${type === 'csv' || type === 'generic' ? '250,204,21' : '239,68,68'},0.08)`,
        border: `1px solid rgba(${type === 'csv' || type === 'generic' ? '250,204,21' : '239,68,68'},0.25)`,
        borderRadius: 'var(--radius-md)',
        position: 'relative',
      }}
    >
      <Icon size={16} style={{ color: cfg.color, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: cfg.color, fontFamily: 'var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {cfg.title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2, fontFamily: 'var(--font-sans)' }}>
          {message || cfg.sub}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', color: 'var(--color-dim)', cursor: 'pointer', padding: 0, fontSize: 14 }}
        >
          ×
        </button>
      )}
    </motion.div>
  );
}

/**
 * ErrorPage – full-page error state.
 */
export function ErrorPage({ type = 'offline', message }) {
  const cfg = ERROR_TYPES[type] || ERROR_TYPES.generic;
  const Icon = cfg.icon;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      gap: 16,
      textAlign: 'center',
      padding: 32,
    }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: `rgba(${type === 'csv' ? '250,204,21' : '239,68,68'},0.1)`,
        border: `1px solid rgba(${type === 'csv' ? '250,204,21' : '239,68,68'},0.2)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={28} style={{ color: cfg.color }} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: cfg.color, fontFamily: 'var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {cfg.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6, maxWidth: 320 }}>
          {message || cfg.sub}
        </div>
      </div>
    </div>
  );
}
