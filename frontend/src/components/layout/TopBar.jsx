import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Clock, Cpu, Database } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * TopBar – top navigation bar with clock, backend status, and model info.
 * Props: isOnline (boolean|null), health (object|null)
 */
export function TopBar({ isOnline, health }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });

  const connStatus  = isOnline === null ? 'loading' : isOnline ? 'online' : 'offline';
  const connLabel   = isOnline === null ? 'CONNECTING' : isOnline ? 'CONNECTED' : 'OFFLINE';

  return (
    <header style={{
      height: 52,
      background: 'var(--color-card)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
      gap: 16,
    }}>
      {/* Left – Page context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 2, height: 18, background: '#3B82F6', borderRadius: 1 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          AeroTwin V6
        </span>
        <span style={{ fontSize: 9, color: 'var(--color-dim)', fontFamily: 'var(--font-display)', fontWeight: 600, padding: '1px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: 100, border: '1px solid var(--color-border)' }}>
          Physics-Guided Digital Twin
        </span>
      </div>

      {/* Right – Status indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
          <Clock size={10} color="var(--color-dim)" />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-text)' }}>
            {timeStr}
          </span>
          <span style={{ fontSize: 9, color: 'var(--color-dim)', fontFamily: 'var(--font-mono)' }}>
            {dateStr}
          </span>
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />

        {/* Model version */}
        {health && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Database size={11} color="var(--color-dim)" />
            <span style={{ fontSize: 10, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
              {health.models_loaded ?? 0} models
            </span>
          </div>
        )}

        {/* API Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {isOnline ? <Wifi size={12} color="#22C55E" /> : <WifiOff size={12} color="#EF4444" />}
          <span style={{ fontSize: 10, color: isOnline ? '#22C55E' : '#EF4444', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            API
          </span>
          <StatusBadge status={connStatus} label={connLabel} pulse={isOnline === null} />
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />

        {/* Version */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Cpu size={11} color="var(--color-dim)" />
          <span style={{ fontSize: 9, color: 'var(--color-dim)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            v6.0
          </span>
        </div>
      </div>
    </header>
  );
}
