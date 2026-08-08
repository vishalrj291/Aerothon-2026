import {
  useAppContext,
  healthPercentage,
  toPercentage,
} from '../context/AppContext';

import { MissionStatusBar } from '../components/dashboard/MissionStatusBar';
import { KPISection } from '../components/dashboard/KPISection';
import { EngineSchematic } from '../components/dashboard/EngineSchematic';
import { RULGauge } from '../components/dashboard/RULGauge';
import { MaintenancePanel } from '../components/dashboard/MaintenancePanel';
import { FleetTable } from '../components/dashboard/FleetTable';
import { PredictionTimeline } from '../components/dashboard/PredictionTimeline';
import { DownloadSection } from '../components/dashboard/DownloadSection';
import { RightPanel } from '../components/layout/RightPanel';
import {
  HealthTrendChart,
  RULTrendChart,
  ThrustTrendChart,
  TSFCTrendChart,
  ComponentHealthChart,
  ConfidenceTrendChart,
} from '../components/charts/EngineeringCharts';

const PAD = 20;

export default function Dashboard() {
  const { latestPrediction, csvResult } = useAppContext();
  const pred = latestPrediction;

  // Build component health from prediction if available
const componentHealth = pred
  ? {
      compressor: pred.CompressorHealth ?? 0,
      combustor: pred.CombustorHealth ?? 0,
      turbine: pred.TurbineHealth ?? 0,
      nozzle: pred.OverallHealth ?? 0,
    }
  : null;
const componentConfidence = pred
  ? {
      compressor: pred.CompressorHealth_Confidence,
      combustor: pred.CombustorHealth_Confidence,
      turbine: pred.TurbineHealth_Confidence,
      nozzle: pred.OverallHealth_Confidence,
    }
  : {};

  const fleetRows = csvResult?.predictions?.map((r, i) => {

  const health = healthPercentage(
    r.OverallHealth
  );

  const confidence = toPercentage(
    r.OverallHealth_Confidence
  );

  return {

    id: r.EngineID
      ? `ENG-${String(r.EngineID).padStart(3, '0')}`
      : `ROW-${i + 1}`,

    cycle: r.Cycle ?? i + 1,

    health,

    rul: r.RUL ?? null,

    risk:
      health >= 80
        ? 'Low'
        : health >= 60
          ? 'Medium'
          : 'High',

    status:
      health >= 80
        ? 'Nominal'
        : health >= 60
          ? 'Monitor'
          : 'Alert',

    confidence,

  };

}) ?? undefined;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* ── Main scroll area ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: PAD, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Mission Status */}
        <MissionStatusBar />

        {/* KPI Cards */}
        <KPISection latestPrediction={pred} />

        {/* Engine Schematic */}
        <EngineSchematic
  health={componentHealth}
  confidence={componentConfidence}
/> 

        {/* RUL + Maintenance row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <RULGauge />
          <MaintenancePanel prediction={pred} />
        </div>

        {/* Analytics section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Analytics & Performance Trends
          </div>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        {/* Charts – 2 column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <HealthTrendChart />
          <RULTrendChart />
          <ThrustTrendChart />
          <TSFCTrendChart />
          <ComponentHealthChart />
          <ConfidenceTrendChart />
        </div>

        {/* Fleet overview label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Fleet Overview
          </div>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        {/* Fleet table */}
        <FleetTable predictions={fleetRows} />

        {/* Timeline + Downloads row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <PredictionTimeline />
          <DownloadSection />
        </div>

        {/* Bottom spacer */}
        <div style={{ height: 8 }} />
      </div>

      {/* ── Right panel ── */}
      <RightPanel latestPrediction={pred} />
    </div>
  );
}
