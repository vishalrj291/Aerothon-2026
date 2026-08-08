import { useAppContext } from '../context/AppContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { CardHeader } from '../components/ui/SectionLabel';
import { RadialGauge } from '../components/ui/RadialGauge';
import { HealthBar } from '../components/ui/HealthBar';
import { ConfidenceRing, ConfidenceBar } from '../components/ui/ConfidenceRing';
import { KPICard } from '../components/ui/KPICard';
import { motion } from 'framer-motion';
import { Activity, Wind, Flame, Zap, Shield, TrendingDown, AlertTriangle } from 'lucide-react';

function DegradationCard({ label, value, confidence, icon: Icon, sublabel, delay }) {
  const pct = value ?? 0;
  const color = pct >= 80 ? '#22C55E' : pct >= 60 ? '#FACC15' : '#EF4444';
  const status = pct >= 80 ? 'NOMINAL' : pct >= 60 ? 'DEGRADED' : 'CRITICAL';
  const deg = 100 - pct;

  return (
    <motion.div
      className="aero-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{ padding: 20 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} style={{ color }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {label}
            </div>
            <div style={{ fontSize: 9, color: 'var(--color-dim)', fontFamily: 'var(--font-display)' }}>{sublabel}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontFamily: 'var(--font-mono)', fontWeight: 700, color, lineHeight: 1 }}>
            {pct.toFixed(1)}
          </div>
          <div style={{ fontSize: 8, color, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.1em' }}>
            {status}
          </div>
        </div>
      </div>

      {/* Health bar */}
      <div style={{ marginBottom: 12 }}>
        <HealthBar label="" value={pct} confidence={confidence} showConf={false} delay={delay} />
      </div>

      {/* Degradation indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 10px',
        background: deg > 20 ? 'rgba(239,68,68,0.08)' : deg > 10 ? 'rgba(250,204,21,0.08)' : 'rgba(34,197,94,0.06)',
        border: `1px solid ${deg > 20 ? 'rgba(239,68,68,0.2)' : deg > 10 ? 'rgba(250,204,21,0.2)' : 'rgba(34,197,94,0.15)'}`,
        borderRadius: 6,
      }}>
        <span style={{ fontSize: 9, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          DEGRADATION
        </span>
        <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700, color: deg > 20 ? '#EF4444' : deg > 10 ? '#FACC15' : '#22C55E' }}>
          {deg.toFixed(1)}%
        </span>
      </div>

      {/* Confidence */}
      {confidence !== undefined && (
        <div style={{ marginTop: 10 }}>
          <ConfidenceBar value={confidence} label="Prediction Confidence" />
        </div>
      )}
    </motion.div>
  );
}

export default function EngineHealth() {
  const { latestPrediction } = useAppContext();
  const pred = latestPrediction;

  const components = [
    { label: 'Compressor', key: 'CompressorHealth', confKey: 'CompressorHealth_Confidence', icon: Wind, sub: 'Blade erosion, fouling & surge margin', delay: 0 },
    { label: 'Combustor',  key: 'CombustorHealth',  confKey: 'CombustorHealth_Confidence',  icon: Flame,sub: 'Liner temp, pattern factor & ignition', delay: 0.1 },
    { label: 'Turbine',    key: 'TurbineHealth',    confKey: 'TurbineHealth_Confidence',    icon: Zap,  sub: 'HPT/LPT blade condition & clearance', delay: 0.2 },
    { label: 'Overall',    key: 'OverallHealth',    confKey: 'OverallHealth_Confidence',    icon: Shield,sub: 'Integrated engine health index', delay: 0.3 },
  ];

  return (
    <PageWrapper
      title="Engine Health Monitor"
      subtitle="Real-time component-level health assessment and degradation tracking"
      icon={<Activity size={18} />}
    >
      {!pred && (
        <motion.div
          className="aero-card"
          style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <AlertTriangle size={36} color="#FACC15" />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
            No Engine Data Available
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', maxWidth: 320, fontFamily: 'var(--font-display)' }}>
            Run a prediction from the Dashboard or Manual Engine page to see component health data.
          </div>
        </motion.div>
      )}

      {pred && (
        <>
          {/* ── Gauges Row ── */}
          <div className="aero-card">
            <CardHeader title="Component Health Overview" icon={<Activity size={14} />} />
            <div style={{ padding: '20px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, justifyItems: 'center' }}>
              {components.map((c) => (
                <RadialGauge
                  key={c.key}
                  value={pred[c.key] ?? 0}
                  size={150}
                  label={c.label}
                  animated
                />
              ))}
            </div>
          </div>

          {/* ── Degradation Cards ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <TrendingDown size={14} color="#3B82F6" />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Degradation Analysis
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {components.map((c) => (
                <DegradationCard
                  key={c.key}
                  label={c.label}
                  value={pred[c.key]}
                  confidence={pred[c.confKey]}
                  icon={c.icon}
                  sublabel={c.sub}
                  delay={c.delay}
                />
              ))}
            </div>
          </div>

          {/* ── Confidence Matrix ── */}
          <div className="aero-card">
            <CardHeader title="Prediction Confidence Matrix" icon={<Shield size={14} />} />
            <div style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, justifyItems: 'center', marginBottom: 20 }}>
                {components.map((c) => (
                  <ConfidenceRing key={c.key} value={pred[c.confKey] ?? 0} size={72} label={c.label} />
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {components.map((c, i) => (
                  <ConfidenceBar key={c.key} value={pred[c.confKey] ?? 0} label={`${c.label} Confidence`} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
