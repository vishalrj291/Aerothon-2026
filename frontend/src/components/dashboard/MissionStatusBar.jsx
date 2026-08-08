import { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertCircle, Database, Cpu } from 'lucide-react';
import { useBackendStatus } from '../../hooks/useBackendStatus';
import { useAppContext } from '../../context/AppContext';

export function MissionStatusBar() {
  const [now, setNow] = useState(new Date());
  const { isOnline, health } = useBackendStatus();
  const { latestPrediction, loading } = useAppContext();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const predStatus = loading ? 'Running' : latestPrediction ? 'Complete' : 'Standby';
  const predColor  = loading ? '#F59E0B' : latestPrediction ? '#22C55E' : '#94A3B8';

  const sysHealth = isOnline ? 'Nominal' : 'Degraded';
  const sysColor  = isOnline ? '#22C55E' : '#EF4444';

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 12,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    }}>
      {/* Title */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Digital Twin Mission Status</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>Real-time engine health monitoring · Physics-guided inference</div>
      </div>

      {/* Status items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        {/* Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={13} color="#94A3B8" />
          <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#1E293B', fontWeight: 600 }}>
            {now.toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <span style={{ fontSize: 10, color: '#94A3B8' }}>
            {now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <div style={{ width: 1, height: 20, background: '#E2E8F0' }} />

        {/* Prediction Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: predColor }} />
          <span style={{ fontSize: 11, color: '#64748B' }}>Prediction:</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: predColor }}>{predStatus}</span>
        </div>

        {/* System Health */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {isOnline ? <CheckCircle size={13} color="#22C55E" /> : <AlertCircle size={13} color="#EF4444" />}
          <span style={{ fontSize: 11, color: '#64748B' }}>System:</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: sysColor }}>{sysHealth}</span>
        </div>

        {/* Backend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: isOnline ? '#22C55E' : '#EF4444', ...(isOnline ? { animation: 'pulse-dot 2s ease-in-out infinite' } : {}) }} />
          <span style={{ fontSize: 11, color: '#64748B' }}>Backend:</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: isOnline ? '#22C55E' : '#EF4444' }}>{isOnline ? 'Connected' : 'Offline'}</span>
        </div>

        {/* Models */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Database size={13} color="#94A3B8" />
          <span style={{ fontSize: 11, color: '#64748B' }}>Models:</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB' }}>{health?.models_loaded ?? 6} Loaded</span>
        </div>
      </div>
    </div>
  );
}
