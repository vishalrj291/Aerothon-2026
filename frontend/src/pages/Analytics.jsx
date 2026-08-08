import { useAppContext } from '../context/AppContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { CardHeader } from '../components/ui/SectionLabel';
import {
  HealthTrendChart,
  ConfidenceTrendChart,
  ThrustTSFCChart,
  ComponentHealthChart,
} from '../components/charts/Charts';
import { BarChart2, TrendingUp, Activity, Gauge } from 'lucide-react';

function ChartCard({ title, icon, children }) {
  return (
    <div className="aero-card">
      <CardHeader title={title} icon={icon} />
      <div style={{ padding: '16px 12px 12px' }}>{children}</div>
    </div>
  );
}

export default function Analytics() {
  const { history } = useAppContext();

  // Build chart-ready data from history
  const chartData = history.map((h, i) => ({
    index: history.length - i,
    OverallHealth: h.OverallHealth,
    CompressorHealth: h.CompressorHealth,
    CombustorHealth: h.CombustorHealth,
    TurbineHealth: h.TurbineHealth,
    OverallHealth_Confidence: h.OverallHealth_Confidence,
    CompressorHealth_Confidence: h.CompressorHealth_Confidence,
    Thrust_N: h.Thrust_N,
    TSFC_g_N_s: h.TSFC_g_N_s,
  })).reverse();

  // Component health bar chart data
  const latest = history[0];
  const componentData = latest ? [
    { name: 'Compressor', value: latest.CompressorHealth ?? 0 },
    { name: 'Combustor',  value: latest.CombustorHealth  ?? 0 },
    { name: 'Turbine',    value: latest.TurbineHealth    ?? 0 },
    { name: 'Overall',    value: latest.OverallHealth    ?? 0 },
  ] : [];

  return (
    <PageWrapper
      title="Analytics"
      subtitle="Historical performance analysis and trend visualization"
      icon={<BarChart2 size={18} />}
    >
      {/* Summary stats */}
      {history.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Predictions',    value: history.length,                                         unit: '' },
            { label: 'Avg Health',     value: (history.reduce((s, h) => s + (h.OverallHealth ?? 0), 0) / history.length).toFixed(1), unit: '%' },
            { label: 'Avg Thrust',     value: (history.reduce((s, h) => s + (h.Thrust_N ?? 0), 0) / history.length).toFixed(0),       unit: 'N' },
            { label: 'Avg Confidence', value: ((history.reduce((s, h) => s + (h.OverallHealth_Confidence ?? 0), 0) / history.length) * 100).toFixed(1), unit: '%' },
          ].map((s) => (
            <div key={s.label} className="aero-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 9, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 26, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#3B82F6' }}>
                {s.value}
                <span style={{ fontSize: 12, color: 'var(--color-muted)', marginLeft: 3 }}>{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <ChartCard title="Engine Health Trend" icon={<TrendingUp size={13} />}>
          <HealthTrendChart data={chartData} />
        </ChartCard>

        <ChartCard title="Prediction Confidence Trend" icon={<Activity size={13} />}>
          <ConfidenceTrendChart data={chartData} />
        </ChartCard>

        <ChartCard title="Thrust & TSFC Performance" icon={<Gauge size={13} />}>
          <ThrustTSFCChart data={chartData} />
        </ChartCard>

        <ChartCard title="Component Health Distribution" icon={<BarChart2 size={13} />}>
          <ComponentHealthChart data={componentData} />
        </ChartCard>
      </div>
    </PageWrapper>
  );
}
