import { FleetTable } from '../components/dashboard/FleetTable';
import { FLEET_DATA, KPI_SUMMARY } from '../data/sampleData';
import { Layers, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

function SummaryCard({ icon: Icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={iconColor} />
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#1E293B', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function Fleet() {
  // Health distribution
  const healthy = FLEET_DATA.filter(e => e.status === 'Nominal').length;
  const monitor = FLEET_DATA.filter(e => e.status === 'Monitor').length;
  const alert   = FLEET_DATA.filter(e => e.status === 'Alert').length;

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Fleet Overview</h1>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Real-time health monitoring across all monitored engine units</p>
      </div>

      {/* Fleet summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <SummaryCard icon={Layers} iconBg="#EFF6FF" iconColor="#2563EB" label="Total Engines" value={FLEET_DATA.length} sub="In active monitoring" />
        <SummaryCard icon={CheckCircle} iconBg="#F0FDF4" iconColor="#22C55E" label="Nominal" value={healthy} sub={`${((healthy/FLEET_DATA.length)*100).toFixed(0)}% of fleet`} />
        <SummaryCard icon={TrendingUp} iconBg="#FFFBEB" iconColor="#F59E0B" label="Monitor" value={monitor} sub="Requires attention" />
        <SummaryCard icon={AlertTriangle} iconBg="#FEF2F2" iconColor="#EF4444" label="Alert" value={alert} sub="Immediate review needed" />
      </div>

      {/* Risk distribution bar */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 12 }}>Fleet Health Distribution</div>
        <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ width: `${(healthy/FLEET_DATA.length)*100}%`, background: '#22C55E', transition: 'width 0.6s ease' }} />
          <div style={{ width: `${(monitor/FLEET_DATA.length)*100}%`, background: '#F59E0B', transition: 'width 0.6s ease' }} />
          <div style={{ width: `${(alert/FLEET_DATA.length)*100}%`, background: '#EF4444', transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { color: '#22C55E', label: 'Nominal',  count: healthy },
            { color: '#F59E0B', label: 'Monitor',  count: monitor },
            { color: '#EF4444', label: 'Alert',    count: alert },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
              <span style={{ fontSize: 11, color: '#64748B' }}>{item.label}:</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', fontFamily: 'monospace' }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full fleet table */}
      <FleetTable />
    </div>
  );
}
