import { useBackendStatus } from '../../hooks/useBackendStatus';
import { useModelInfo } from '../../hooks/useModelInfo';
import { SYSTEM_INFO } from '../../data/sampleData';
import { CheckCircle, XCircle, Cpu, Zap, Shield, Activity, Clock, AlertTriangle } from 'lucide-react';
import { ConfidenceBar } from '../ui/ConfidenceRing';

function SysRow({ icon: Icon, label, value, color = '#1E293B', badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={13} color="#64748B" />
        <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter' }}>{label}</span>
      </div>
      {badge || <span style={{ fontSize: 11, fontWeight: 600, color, fontFamily: 'monospace' }}>{value}</span>}
    </div>
  );
}

function StatusBadge({ active, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 100,
      background: active ? '#F0FDF4' : '#F8FAFC',
      border: `1px solid ${active ? '#BBF7D0' : '#E2E8F0'}`,
      fontSize: 10, fontWeight: 600,
      color: active ? '#16A34A' : '#94A3B8',
    }}>
      {active ? <CheckCircle size={9} /> : <XCircle size={9} />}
      {label}
    </div>
  );
}

export function RightPanel({ latestPrediction }) {
  const { isOnline, health } = useBackendStatus();
  const { modelInfo } = useModelInfo();

  const avgConf = latestPrediction
    ? ((latestPrediction.OverallHealth_Confidence ?? 0.93) * 100)
    : 93.2;

  const models = modelInfo
    ? Object.entries(modelInfo.Models || {}).slice(0, 4).map(([k, v]) => ({ name: v.BestModel || 'XGBoost', target: k }))
    : SYSTEM_INFO.models.slice(0, 4);

  return (
    <aside style={{
      width: 260,
      flexShrink: 0,
      background: '#fff',
      borderLeft: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8' }}>
          System Information
        </div>
      </div>

      {/* Backend Status */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Backend Status</div>
        <SysRow icon={Activity} label="Connection" badge={<StatusBadge active={!!isOnline} label={isOnline ? 'Online' : 'Offline'} />} />
        <SysRow icon={Cpu} label="Models Loaded" value={health?.models_loaded ?? SYSTEM_INFO.models.length} color="#2563EB" />
        <SysRow icon={Clock} label="Inference Time" value={`${SYSTEM_INFO.inferenceTimeMs} ms`} />
      </div>

      {/* Subsystems */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Subsystems</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={12} color="#64748B" />
              <span style={{ fontSize: 11, color: '#64748B' }}>Physics Engine</span>
            </div>
            <StatusBadge active label="Active" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={12} color="#64748B" />
              <span style={{ fontSize: 11, color: '#64748B' }}>Validation</span>
            </div>
            <StatusBadge active label="Active" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={12} color="#64748B" />
              <span style={{ fontSize: 11, color: '#64748B' }}>Health Prognostics</span>
            </div>
            <StatusBadge active label="Active" />
          </div>
        </div>
      </div>

      {/* Models */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Models Loaded</div>
        {models.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #F8FAFC' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1E293B' }}>{m.name}</div>
              <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Inter' }}>{m.target?.replace(/_/g,' ')?.replace('Health','Hlth')}</div>
            </div>
            <StatusBadge active label="Loaded" />
          </div>
        ))}
      </div>

      {/* Prediction Confidence */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Prediction Confidence
        </div>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#22C55E', fontFamily: 'monospace', lineHeight: 1 }}>
            {avgConf.toFixed(1)}%
          </div>
          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>Average across all targets</div>
        </div>
        <div className="ae-progress-track">
          <div className="ae-progress-fill" style={{ background: '#22C55E', width: `${avgConf}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 9, color: '#94A3B8' }}>Low</span>
          <span style={{ fontSize: 9, color: '#94A3B8' }}>High</span>
        </div>
      </div>
    </aside>
  );
}
