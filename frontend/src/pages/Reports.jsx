import { useAppContext } from '../context/AppContext';
import { getDownloadURL } from '../api/client';
import { FLEET_DATA, MAINTENANCE_DATA, HEALTH_TREND } from '../data/sampleData';
import { DownloadSection } from '../components/dashboard/DownloadSection';
import { PredictionTimeline } from '../components/dashboard/PredictionTimeline';
import {
  HealthTrendChart,
  RULTrendChart,
  ComponentHealthChart,
  ConfidenceTrendChart,
} from '../components/charts/EngineeringCharts';
import { Download, FileText, Calendar, Activity, Shield } from 'lucide-react';

function ReportCard({ icon: Icon, iconBg, iconColor, title, sub, value, unit }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={iconColor} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{sub}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{title}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#2563EB', fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
        {unit && <div style={{ fontSize: 10, color: '#94A3B8' }}>{unit}</div>}
      </div>
    </div>
  );
}

export default function Reports() {
  const { history, csvResult } = useAppContext();
  const lastTs = history[0]?._timestamp;

  const avgHealth = history.length
    ? (history.reduce((s, h) => s + (h.OverallHealth ?? 0), 0) / history.length).toFixed(1)
    : HEALTH_TREND[HEALTH_TREND.length - 1].health.toFixed(1);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Reports & Analytics</h1>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Session summaries, performance trends, and downloadable reports</p>
      </div>

      {/* Session summary */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Session Summary
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <ReportCard icon={Activity} iconBg="#EFF6FF" iconColor="#2563EB" sub="Predictions Run" title="Manual Predictions" value={history.length} unit="runs" />
          <ReportCard icon={Shield} iconBg="#F0FDF4" iconColor="#22C55E" sub="Fleet average" title="Avg Overall Health" value={avgHealth} unit="%" />
          <ReportCard icon={FileText} iconBg="#FFFBEB" iconColor="#F59E0B" sub="Batch results" title="CSV Rows Processed" value={csvResult?.rows ?? 0} unit="rows" />
        </div>
      </div>

      {lastTs && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, marginBottom: 20, width: 'fit-content' }}>
          <Calendar size={13} color="#94A3B8" />
          <span style={{ fontSize: 11, color: '#64748B' }}>Last prediction: <strong style={{ color: '#1E293B' }}>{new Date(lastTs).toLocaleString()}</strong></span>
        </div>
      )}

      {/* Charts */}
      <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        Performance Trend Analysis
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <HealthTrendChart />
        <RULTrendChart />
        <ComponentHealthChart />
        <ConfidenceTrendChart />
      </div>

      {/* Downloads + Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <DownloadSection />
        <PredictionTimeline />
      </div>
    </div>
  );
}
