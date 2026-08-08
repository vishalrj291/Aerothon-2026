import { useBackendStatus } from '../hooks/useBackendStatus';
import { useModelInfo } from '../hooks/useModelInfo';
import { SYSTEM_INFO } from '../data/sampleData';
import { Server, Cpu, Wifi, CheckCircle, XCircle, RefreshCw, Info } from 'lucide-react';

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 16 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{title}</div>
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
      <span style={{ fontSize: 12, color: '#64748B' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: mono ? 'JetBrains Mono, monospace' : 'Inter, sans-serif' }}>{value}</span>
    </div>
  );
}

function EndpointRow({ method, path, desc }) {
  const isGet = method === 'GET';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid #F8FAFC' }}>
      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', background: isGet ? '#F0FDF4' : '#EFF6FF', color: isGet ? '#16A34A' : '#2563EB', border: `1px solid ${isGet ? '#BBF7D0' : '#BFDBFE'}`, minWidth: 40, textAlign: 'center' }}>
        {method}
      </span>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#1E293B', flex: 1 }}>{path}</span>
      <span style={{ fontSize: 11, color: '#94A3B8' }}>{desc}</span>
    </div>
  );
}

export default function Settings() {
  const { isOnline, health } = useBackendStatus();
  const { modelInfo, refetch } = useModelInfo();

  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const models = modelInfo
    ? Object.entries(modelInfo.Models || {}).map(([k, v]) => ({ name: v.BestModel || 'XGBoost', target: k, r2: v.R2 }))
    : SYSTEM_INFO.models;

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Settings</h1>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>System configuration, API endpoints, and model registry</p>
      </div>

      {/* Backend Connection */}
      <Section title="Backend Connection">
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>API Base URL</div>
          <div style={{ padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#2563EB' }}>
            {apiUrl}
          </div>
          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 5 }}>Configure via VITE_API_URL environment variable</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            {
              label: 'Connection Status',
              value: isOnline === null ? 'Connecting...' : isOnline ? 'Connected' : 'Offline',
              color: isOnline ? '#22C55E' : isOnline === null ? '#F59E0B' : '#EF4444',
            },
            { label: 'Models Loaded', value: `${health?.models_loaded ?? SYSTEM_INFO.models.length}`, color: '#2563EB' },
            { label: 'Inference Time', value: `${SYSTEM_INFO.inferenceTimeMs} ms`, color: '#1E293B' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* API Endpoints */}
      <Section title="API Endpoints">
        {[
          { method: 'GET',  path: '/',                desc: 'Root information' },
          { method: 'GET',  path: '/health',           desc: 'Backend health check' },
          { method: 'GET',  path: '/model-info',       desc: 'Model registry & metrics' },
          { method: 'POST', path: '/predict/single',   desc: 'Single engine state prediction' },
          { method: 'POST', path: '/predict/csv',      desc: 'Batch CSV prediction' },
          { method: 'GET',  path: '/download/latest',  desc: 'Download prediction CSV' },
        ].map((ep, i) => <EndpointRow key={i} {...ep} />)}
      </Section>

      {/* Model Registry */}
      <Section title="Model Registry">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button className="ae-btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={refetch}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
        {models.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{m.target?.replace(/_/g, ' ')}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{m.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {m.r2 != null && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>R²</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#22C55E', fontFamily: 'monospace' }}>{m.r2.toFixed(3)}</div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 100, background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: 10, fontWeight: 700, color: '#16A34A' }}>
                <CheckCircle size={10} /> Loaded
              </div>
            </div>
          </div>
        ))}
      </Section>

      {/* Subsystems */}
      <Section title="Subsystem Status">
        {[
          { label: 'Physics-Guided Feature Engineering', desc: 'Thermodynamic first-principles feature extraction', active: true },
          { label: 'Schema Validation',                  desc: 'Input data validation and type checking',         active: true },
          { label: 'Health Prognostics Engine',          desc: 'Multi-target health degradation modeling',        active: true },
          { label: 'RUL Estimation Module',              desc: 'Remaining useful life prediction and prognostics', active: true },
          { label: 'Confidence Estimation',              desc: 'Prediction confidence scoring per target',         active: true },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{s.desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 100, background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: 10, fontWeight: 700, color: '#16A34A', flexShrink: 0 }}>
              <CheckCircle size={10} /> Active
            </div>
          </div>
        ))}
      </Section>

      {/* Version */}
      <Section title="System Information">
        <InfoRow label="Frontend Version" value="AeroTwin V6" />
        <InfoRow label="API Version" value={`v${modelInfo?.Version ?? '6.0'}`} mono />
        <InfoRow label="Project" value={modelInfo?.Project ?? 'AeroTwin'} />
        <InfoRow label="Physics-Guided" value={modelInfo?.PhysicsGuided ? 'Yes' : 'Yes (default)'} />
        <InfoRow label="Prediction Targets" value={modelInfo?.Targets ?? SYSTEM_INFO.models.length} mono />
        <InfoRow label="Design Theme" value="Professional Aerospace / Light" />
      </Section>
    </div>
  );
}
