import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Play, RotateCcw, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { CardHeader } from '../components/ui/SectionLabel';
import { EngineerSlider } from '../components/ui/EngineerSlider';
import { RadialGauge } from '../components/ui/RadialGauge';
import { KPICard } from '../components/ui/KPICard';
import { HealthBar } from '../components/ui/HealthBar';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { Loader } from '../components/ui/Loader';
import { ConfidenceBar } from '../components/ui/ConfidenceRing';

// ── Parameter definitions with engineering limits ────────────
const PARAMS = [
  {
    group: 'FLIGHT CONDITIONS',
    fields: [
      { name: 'EngineID', label: 'Engine ID',       min: 1,      max: 100,    step: 1,    unit: '',   default: 1,       limits: null },
      { name: 'Cycle',    label: 'Flight Cycle',    min: 1,      max: 500,    step: 1,    unit: '',   default: 10,      limits: null },
      { name: 'Altitude_m',label: 'Altitude',       min: 0,      max: 15000,  step: 100,  unit: 'm',  default: 5000,    limits: { warning: 0.75, critical: 0.93 } },
      { name: 'Mach',     label: 'Mach Number',     min: 0,      max: 1.2,    step: 0.01, unit: 'M',  default: 0.50,    limits: { warning: 0.78, critical: 0.92 } },
    ],
  },
  {
    group: 'AMBIENT CONDITIONS',
    fields: [
      { name: 'Tamb_K',  label: 'Ambient Temp',    min: 200,    max: 320,    step: 1,    unit: 'K',  default: 250,     limits: { warning: 0.80, critical: 0.94 } },
      { name: 'Pamb_Pa', label: 'Ambient Pressure', min: 20000,  max: 105000, step: 500,  unit: 'Pa', default: 54000,   limits: null },
    ],
  },
  {
    group: 'ENGINE PARAMETERS',
    fields: [
      { name: 'RPM_rev_min', label: 'Engine RPM',    min: 10000,  max: 120000, step: 1000, unit: 'RPM',default: 60000,   limits: { warning: 0.78, critical: 0.92 } },
      { name: 'FuelFlow_kg_s',label: 'Fuel Flow',    min: 0.2,    max: 3.0,    step: 0.05, unit: 'kg/s',default: 1.2,   limits: { warning: 0.80, critical: 0.93 } },
    ],
  },
  {
    group: 'COMPRESSOR SECTION (P2/T2)',
    fields: [
      { name: 'P2_Pa', label: 'Inlet Pressure P2', min: 50000,  max: 400000, step: 1000, unit: 'Pa', default: 220000,  limits: { warning: 0.82, critical: 0.95 } },
      { name: 'T2_K',  label: 'Inlet Temp T2',     min: 250,    max: 700,    step: 5,    unit: 'K',  default: 420,     limits: { warning: 0.80, critical: 0.93 } },
    ],
  },
  {
    group: 'COMBUSTOR SECTION (P3/T3)',
    fields: [
      { name: 'P3_Pa', label: 'Exit Pressure P3',  min: 50000,  max: 400000, step: 1000, unit: 'Pa', default: 210000,  limits: { warning: 0.82, critical: 0.95 } },
      { name: 'T3_K',  label: 'Combustor Temp T3', min: 700,    max: 1800,   step: 10,   unit: 'K',  default: 1100,    limits: { warning: 0.76, critical: 0.91 } },
    ],
  },
  {
    group: 'TURBINE SECTION (P4/T4)',
    fields: [
      { name: 'P4_Pa', label: 'Exhaust Pressure P4', min: 20000, max: 200000, step: 1000, unit: 'Pa', default: 90000,  limits: { warning: 0.78, critical: 0.92 } },
      { name: 'T4_K',  label: 'Exhaust Temp T4',     min: 400,   max: 1100,   step: 10,   unit: 'K',  default: 750,    limits: { warning: 0.80, critical: 0.93 } },
    ],
  },
];

const DEFAULT_VALUES = Object.fromEntries(
  PARAMS.flatMap(g => g.fields).map(f => [f.name, f.default])
);

export default function ManualPrediction() {
  const { loading, error, latestPrediction, runSinglePrediction, clearError } = useAppContext();
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [result, setResult] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const field = PARAMS.flatMap(g => g.fields).find(f => f.name === name);
    setValues(prev => ({ ...prev, [name]: field?.step < 1 ? parseFloat(value) : parseInt(value, 10) }));
  }, []);

  const handleReset = () => { setValues(DEFAULT_VALUES); setResult(null); clearError(); };

  const handlePredict = async () => {
    clearError();
    try {
      const pred = await runSinglePrediction(values);
      setResult(pred);
    } catch { /* handled */ }
  };

  const pred = result;

  return (
    <PageWrapper
      title="Manual Engine Prediction"
      subtitle="Configure engine parameters and run single-shot health assessment"
      icon={<Sliders size={18} />}
      actions={
        <button className="btn-secondary" onClick={handleReset} id="manual-reset-btn">
          <RotateCcw size={13} /> Reset Defaults
        </button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'start' }}>

        {/* ── Left: Parameter sliders ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PARAMS.map((group) => (
            <div key={group.group} className="aero-card">
              <CardHeader title={group.group} icon={<Sliders size={12} />} />
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {group.fields.map((field) => (
                  <EngineerSlider
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={values[field.name]}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    unit={field.unit}
                    onChange={handleChange}
                    limits={field.limits}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Run button */}
          <button
            id="manual-predict-btn"
            className="btn-primary"
            disabled={loading}
            onClick={handlePredict}
            style={{ padding: '14px 20px', fontSize: 13 }}
          >
            {loading ? <Loader size={14} /> : <Play size={14} />}
            {loading ? 'Computing Digital Twin...' : 'Run Engine Prediction'}
          </button>

          {error && <ErrorBanner message={error} type="prediction" onDismiss={clearError} />}
        </div>

        {/* ── Right: Results panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 20 }}>
          <div className="aero-card">
            <CardHeader
              title="Prediction Results"
              icon={pred ? <CheckCircle size={13} style={{ color: '#22C55E' }} /> : <Sliders size={13} />}
            />
            <div style={{ padding: 16 }}>
              {pred ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                  >
                    {/* Overall gauge */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <RadialGauge
                        value={pred.OverallHealth}
                        size={160}
                        label="Overall Health"
                        animated
                      />
                    </div>

                    {/* Component health bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <HealthBar label="Compressor" value={pred.CompressorHealth} confidence={pred.CompressorHealth_Confidence} delay={0} />
                      <HealthBar label="Combustor"  value={pred.CombustorHealth}  confidence={pred.CombustorHealth_Confidence}  delay={0.1} />
                      <HealthBar label="Turbine"    value={pred.TurbineHealth}    confidence={pred.TurbineHealth_Confidence}    delay={0.2} />
                    </div>

                    {/* Performance */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                        PERFORMANCE OUTPUT
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                          { label: 'Thrust', value: pred.Thrust_N?.toFixed(0), unit: 'N', conf: pred.Thrust_N_Confidence },
                          { label: 'TSFC', value: pred.TSFC_g_N_s?.toFixed(4), unit: 'g/N·s', conf: pred.TSFC_g_N_s_Confidence },
                        ].map(m => (
                          <div key={m.label} className="aero-card-inner" style={{ padding: '10px 12px' }}>
                            <div style={{ fontSize: 9, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                              {m.label}
                            </div>
                            <div style={{ fontSize: 20, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#3B82F6' }}>
                              {m.value}
                            </div>
                            <div style={{ fontSize: 9, color: 'var(--color-dim)', marginBottom: 6 }}>{m.unit}</div>
                            <ConfidenceBar value={m.conf} showLabel={false} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-dim)', fontSize: 11, fontFamily: 'var(--font-display)' }}>
                  Configure parameters and run prediction to see results here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
