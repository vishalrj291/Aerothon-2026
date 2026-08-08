import { useModelInfo } from '../hooks/useModelInfo';
import { PageWrapper } from '../components/layout/PageWrapper';
import { CardHeader } from '../components/ui/SectionLabel';
import { PageLoader } from '../components/ui/Loader';
import { ErrorPage } from '../components/ui/ErrorBanner';
import { motion } from 'framer-motion';
import { Info, Cpu, CheckCircle, Activity, Zap, TrendingUp } from 'lucide-react';

function MetricBadge({ label, value, unit = '', color = '#3B82F6' }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 12px' }}>
      <div style={{ fontSize: 22, fontFamily: 'var(--font-mono)', fontWeight: 700, color, lineHeight: 1 }}>
        {value != null ? (typeof value === 'number' ? value.toFixed(4) : value) : '—'}
        {unit && <span style={{ fontSize: 10, color: 'var(--color-muted)', marginLeft: 2 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 9, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function ModelCard({ target, data, index }) {
  const isGoodR2 = (data.R2 ?? 0) >= 0.9;
  const r2Color  = (data.R2 ?? 0) >= 0.9 ? '#22C55E' : (data.R2 ?? 0) >= 0.7 ? '#FACC15' : '#EF4444';

  return (
    <motion.div
      className="aero-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <div style={{ padding: '14px 16px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {target}
            </div>
            <div style={{ fontSize: 10, color: '#3B82F6', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              {data.BestModel ?? 'Unknown'}
            </div>
          </div>
          <div style={{
            padding: '3px 8px',
            background: isGoodR2 ? 'rgba(34,197,94,0.1)' : 'rgba(250,204,21,0.1)',
            border: `1px solid ${isGoodR2 ? 'rgba(34,197,94,0.3)' : 'rgba(250,204,21,0.3)'}`,
            borderRadius: 100,
            fontSize: 9,
            fontWeight: 700,
            color: isGoodR2 ? '#22C55E' : '#FACC15',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {isGoodR2 ? 'HIGH PERF' : 'STANDARD'}
          </div>
        </div>

        {/* Feature count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: '6px 8px', background: 'rgba(59,130,246,0.06)', borderRadius: 6, border: '1px solid rgba(59,130,246,0.12)' }}>
          <Cpu size={11} color="#3B82F6" />
          <span style={{ fontSize: 10, color: 'var(--color-muted)', fontFamily: 'var(--font-display)' }}>
            Feature Count:
          </span>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#3B82F6' }}>
            {data.FeatureCount ?? '—'}
          </span>
        </div>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--color-border)' }}>
        <MetricBadge label="R²" value={data.R2} color={r2Color} />
        <div style={{ width: 1, background: 'var(--color-border)' }} />
        <MetricBadge label="RMSE" value={data.RMSE} color="var(--color-text)" />
        <div style={{ width: 1, background: 'var(--color-border)' }} />
        <MetricBadge label="MAE" value={data.MAE} color="var(--color-text)" />
        <div style={{ width: 1, background: 'var(--color-border)' }} />
        <MetricBadge label="MAPE %" value={data.MAPE} color="var(--color-text)" />
      </div>
    </motion.div>
  );
}

export default function ModelInfo() {
  const { modelInfo, loading, error, refetch } = useModelInfo();

  if (loading) return (
    <PageWrapper title="Model Information" icon={<Info size={18} />}>
      <PageLoader label="Loading Model Registry..." />
    </PageWrapper>
  );

  if (error) return (
    <PageWrapper title="Model Information" icon={<Info size={18} />}>
      <ErrorPage type="offline" message={error} />
    </PageWrapper>
  );

  const models = modelInfo?.Models ?? {};
  const targets = Object.keys(models);

  return (
    <PageWrapper
      title="Model Information"
      subtitle="Physics-guided ML model registry and performance metrics"
      icon={<Info size={18} />}
      actions={
        <button className="btn-secondary" onClick={refetch} id="model-refresh-btn">
          <TrendingUp size={13} /> Refresh
        </button>
      }
    >
      {/* Project card */}
      <div className="aero-card">
        <CardHeader title="AeroTwin Model Registry" icon={<Cpu size={14} />} />
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {[
            { label: 'Project',    value: modelInfo?.Project ?? '—',            icon: Activity },
            { label: 'Version',    value: `v${modelInfo?.Version ?? '—'}`,      icon: Info },
            { label: 'Targets',    value: modelInfo?.Targets ?? 0,              icon: Cpu },
            { label: 'Physics AI', value: modelInfo?.PhysicsGuided ? 'YES' : 'NO', icon: Zap },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ textAlign: 'center', padding: '12px 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  <Icon size={16} color="#3B82F6" />
                </div>
                <div style={{ fontSize: 16, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#3B82F6' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 9, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physics features callout */}
      <div className="aero-card" style={{ borderColor: 'rgba(59,130,246,0.25)' }}>
        <CardHeader title="Physics-Guided Feature Engineering" icon={<Zap size={14} />} />
        <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            'Pressure Ratio (P3/P2)',
            'Temperature Ratio (T3/T2)',
            'Isentropic Compressor Efficiency (ηc)',
            'Fuel-Air Equivalence Ratio (φ)',
            'Turbine Inlet Temperature (TIT)',
            'Compressor Pressure Rise (ΔP)',
            'Thermal Efficiency Index',
            'Specific Thrust Coefficient',
            'Cycle Wear Factor',
          ].map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', background: 'rgba(59,130,246,0.04)', borderRadius: 6, border: '1px solid rgba(59,130,246,0.1)' }}>
              <CheckCircle size={10} color="#22C55E" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target models grid */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          PREDICTION TARGETS — {targets.length} models
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {targets.map((target, i) => (
            <ModelCard key={target} target={target} data={models[target]} index={i} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
