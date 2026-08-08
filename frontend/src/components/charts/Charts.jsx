import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

const CHART_STYLE = {
  background: 'transparent',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="aero-tooltip">
      <div style={{ marginBottom: 4, fontSize: 10, color: 'var(--color-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>
        CYCLE #{label}
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 11 }}>
          <span style={{ color: p.color, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{p.name}</span>
          <span style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * HealthTrendChart – area chart of health values over prediction history.
 */
export function HealthTrendChart({ data = [] }) {
  if (data.length === 0) {
    return <SampleViz label="Health Trend" />;
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} style={CHART_STYLE}>
        <defs>
          <linearGradient id="gradOverall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradComp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={80} stroke="rgba(250,204,21,0.3)" strokeDasharray="4 3" />
        <ReferenceLine y={60} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 3" />
        <Area type="monotone" dataKey="OverallHealth" name="Overall" stroke="#22C55E" fill="url(#gradOverall)" strokeWidth={2} dot={false} />
        <Area type="monotone" dataKey="CompressorHealth" name="Compressor" stroke="#3B82F6" fill="url(#gradComp)" strokeWidth={1.5} dot={false} />
        <Area type="monotone" dataKey="TurbineHealth" name="Turbine" stroke="#FACC15" fill="transparent" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * ConfidenceTrendChart – confidence over time.
 */
export function ConfidenceTrendChart({ data = [] }) {
  if (data.length === 0) return <SampleViz label="Confidence Trend" />;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} style={CHART_STYLE}>
        <defs>
          <linearGradient id="gradConf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0.85} stroke="rgba(34,197,94,0.3)" strokeDasharray="4 3" />
        <ReferenceLine y={0.65} stroke="rgba(250,204,21,0.3)" strokeDasharray="4 3" />
        <Area type="monotone" dataKey="OverallHealth_Confidence" name="Overall Conf" stroke="#3B82F6" fill="url(#gradConf)" strokeWidth={2} dot={false} />
        <Area type="monotone" dataKey="CompressorHealth_Confidence" name="Compressor Conf" stroke="#8B5CF6" fill="transparent" strokeWidth={1.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * ThrustTSFCChart – thrust and TSFC over prediction history.
 */
export function ThrustTSFCChart({ data = [] }) {
  if (data.length === 0) return <SampleViz label="Thrust & TSFC" />;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} style={CHART_STYLE}>
        <defs>
          <linearGradient id="gradThrust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" tick={{ fontSize: 10 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area yAxisId="left" type="monotone" dataKey="Thrust_N" name="Thrust (N)" stroke="#3B82F6" fill="url(#gradThrust)" strokeWidth={2} dot={false} />
        <Area yAxisId="right" type="monotone" dataKey="TSFC_g_N_s" name="TSFC (g/N·s)" stroke="#FACC15" fill="transparent" strokeWidth={1.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * ComponentHealthChart – bar chart of component health values.
 */
import { BarChart, Bar, Cell } from 'recharts';

export function ComponentHealthChart({ data = [] }) {
  if (data.length === 0) return <SampleViz label="Component Health Distribution" />;
  const getColor = (v) => v >= 80 ? '#22C55E' : v >= 60 ? '#FACC15' : '#EF4444';
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} style={CHART_STYLE} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" name="Health" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getColor(entry.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * SampleViz – placeholder chart when no data is available.
 */
function SampleViz({ label }) {
  const sampleData = [70, 75, 72, 78, 74, 80, 76, 82, 79, 85].map((v, i) => ({ i, v }));
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        backdropFilter: 'blur(1px)',
      }}>
        <span style={{
          fontSize: 9,
          color: 'var(--color-muted)',
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid var(--color-border)',
          padding: '3px 8px',
          borderRadius: 100,
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          SAMPLE VISUALIZATION – run a prediction to see live data
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={sampleData} style={CHART_STYLE}>
          <defs>
            <linearGradient id="gradSample" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke="rgba(59,130,246,0.3)" fill="url(#gradSample)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
