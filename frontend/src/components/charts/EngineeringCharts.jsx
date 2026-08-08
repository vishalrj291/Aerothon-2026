import {
  ResponsiveContainer,
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { HEALTH_TREND } from '../../data/sampleData';

// ── Shared chart config ───────────────────────────────────────
const FONT = { fontFamily: 'Inter, sans-serif', fontSize: 11 };
const GRID_COLOR = '#F1F5F9';
const AXIS_COLOR = '#CBD5E1';
const LABEL_COLOR = '#64748B';

const CUSTOM_TOOLTIP_STYLE = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: 8,
  padding: '8px 12px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  fontSize: 12,
  fontFamily: 'Inter, sans-serif',
};

function EngineeringTooltip({ active, payload, label, units = {} }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CUSTOM_TOOLTIP_STYLE}>
      <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3, color: p.color }}>
          <span style={{ color: '#64748B', fontWeight: 500 }}>{p.name}</span>
          <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            {units[p.dataKey] || ''}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChartContainer({ title, subtitle, children, height = 200 }) {
  return (
    <div className="ae-card" style={{ padding: '18px 20px' }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ height }}>
        {children}
      </div>
    </div>
  );
}

// ── 1. Health Trend ───────────────────────────────────────────
export function HealthTrendChart({ data }) {
  const d = data?.length ? data : HEALTH_TREND;
  return (
    <ChartContainer title="Engine Health Trend" subtitle="Overall health index over time (%)">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={d} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="period" tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={{ stroke: AXIS_COLOR }} tickLine={false} />
          <YAxis domain={[80, 100]} tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={false} tickLine={false} />
          <Tooltip content={<EngineeringTooltip units={{ health: '%' }} />} />
          <ReferenceLine y={90} stroke="#E2E8F0" strokeDasharray="4 4" label={{ value: 'Nominal', position: 'right', fill: '#94A3B8', fontSize: 9, fontFamily: 'Inter' }} />
          <Area type="monotone" dataKey="health" name="Overall Health" stroke="#22C55E" fill="url(#healthGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#22C55E' }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ── 2. RUL Trend ──────────────────────────────────────────────
export function RULTrendChart({ data }) {
  const d = data?.length ? data : HEALTH_TREND;
  return (
    <ChartContainer title="Remaining Useful Life Trend" subtitle="RUL prognostics over fleet cycles">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={d} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rulGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="period" tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={{ stroke: AXIS_COLOR }} tickLine={false} />
          <YAxis domain={[0, 450]} tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={false} tickLine={false} />
          <Tooltip content={<EngineeringTooltip units={{ rul: ' cycles' }} />} />
          <ReferenceLine y={50} stroke="#FECACA" strokeDasharray="4 4" label={{ value: 'Threshold', position: 'right', fill: '#EF4444', fontSize: 9 }} />
          <Area type="monotone" dataKey="rul" name="Remaining RUL" stroke="#F59E0B" fill="url(#rulGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#F59E0B' }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ── 3. Thrust Trend ───────────────────────────────────────────
export function ThrustTrendChart({ data }) {
  const d = data?.length ? data : HEALTH_TREND;
  return (
    <ChartContainer title="Thrust Output Trend" subtitle="Net thrust (N) over operational cycles">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={d} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="period" tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={{ stroke: AXIS_COLOR }} tickLine={false} />
          <YAxis domain={[82000, 90000]} tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<EngineeringTooltip units={{ thrust: ' N' }} />} />
          <Line type="monotone" dataKey="thrust" name="Thrust" stroke="#2563EB" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#2563EB' }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ── 4. TSFC Trend ─────────────────────────────────────────────
export function TSFCTrendChart({ data }) {
  const d = data?.length ? data : HEALTH_TREND;
  return (
    <ChartContainer title="TSFC Trend" subtitle="Thrust-specific fuel consumption (mg/N·s)">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={d} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="period" tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={{ stroke: AXIS_COLOR }} tickLine={false} />
          <YAxis domain={[17, 22]} tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={false} tickLine={false} />
          <Tooltip content={<EngineeringTooltip units={{ tsfc: ' mg/N·s' }} />} />
          <Line type="monotone" dataKey="tsfc" name="TSFC" stroke="#EF4444" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#EF4444' }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ── 5. Component Health Comparison ────────────────────────────
export function ComponentHealthChart({ data }) {
  const d = data?.length ? data : HEALTH_TREND;
  const last6 = d.slice(-6);
  return (
    <ChartContainer title="Component Health Comparison" subtitle="Compressor · Combustor · Turbine (last 6 periods)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={last6} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="period" tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={{ stroke: AXIS_COLOR }} tickLine={false} />
          <YAxis domain={[80, 100]} tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={false} tickLine={false} />
          <Tooltip content={<EngineeringTooltip units={{ compressor: '%', combustor: '%', turbine: '%' }} />} />
          <Legend wrapperStyle={{ ...FONT, color: LABEL_COLOR, paddingTop: 8 }} />
          <Bar dataKey="compressor" name="Compressor" fill="#2563EB" fillOpacity={0.85} radius={[3,3,0,0]} maxBarSize={18} />
          <Bar dataKey="combustor"  name="Combustor"  fill="#22C55E" fillOpacity={0.85} radius={[3,3,0,0]} maxBarSize={18} />
          <Bar dataKey="turbine"    name="Turbine"    fill="#F59E0B" fillOpacity={0.85} radius={[3,3,0,0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ── 6. Confidence Trend ───────────────────────────────────────
export function ConfidenceTrendChart({ data }) {
  const d = data?.length ? data : HEALTH_TREND;
  return (
    <ChartContainer title="Prediction Confidence Trend" subtitle="Model confidence score over time (%)">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={d} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="period" tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={{ stroke: AXIS_COLOR }} tickLine={false} />
          <YAxis domain={[85, 100]} tick={{ ...FONT, fill: LABEL_COLOR }} axisLine={false} tickLine={false} />
          <Tooltip content={<EngineeringTooltip units={{ confidence: '%' }} />} />
          <ReferenceLine y={90} stroke="#E2E8F0" strokeDasharray="4 4" label={{ value: '90%', position: 'right', fill: '#94A3B8', fontSize: 9 }} />
          <Area type="monotone" dataKey="confidence" name="Confidence" stroke="#7C3AED" fill="url(#confGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#7C3AED' }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
