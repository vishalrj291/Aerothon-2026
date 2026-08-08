import { CheckCircle, AlertTriangle, XCircle, Clock, Wrench, Info } from 'lucide-react';
import { MAINTENANCE_DATA } from '../../data/sampleData';

function StatusIcon({ status }) {
  if (status === 'Healthy') return <CheckCircle size={18} color="#22C55E" />;
  if (status === 'Warning') return <AlertTriangle size={18} color="#F59E0B" />;
  return <XCircle size={18} color="#EF4444" />;
}

function riskColor(risk) {
  if (risk === 'Low')    return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' };
  if (risk === 'Medium') return { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' };
  return                        { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' };
}

export function MaintenancePanel({ prediction }) {
  const data = MAINTENANCE_DATA;
  const riskC = riskColor(data.risk);

  return (
    <div className="ae-card" style={{ padding: '20px 22px' }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Maintenance Assessment</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>Physics-guided predictive maintenance analysis</div>
      </div>

      {/* Status + risk */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8 }}>
          <StatusIcon status={data.status} />
          <div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Status</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#16A34A' }}>{data.status}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, padding: '10px 14px', background: riskC.bg, border: `1px solid ${riskC.border}`, borderRadius: 8 }}>
          <AlertTriangle size={18} color={riskC.text} />
          <div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Risk Level</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: riskC.text }}>{data.risk}</div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div style={{ padding: '10px 14px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <Info size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1D4ED8', marginBottom: 2 }}>Recommendation</div>
            <div style={{ fontSize: 12, color: '#1E293B', lineHeight: 1.5 }}>{data.recommendation}</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6, marginBottom: 14 }}>{data.notes}</div>

      {/* Next inspection */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, marginBottom: 14 }}>
        <Clock size={13} color="#94A3B8" />
        <span style={{ fontSize: 11, color: '#64748B' }}>Next inspection after</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', fontFamily: 'monospace' }}>{data.nextInspection} cycles</span>
      </div>

      {/* Action items */}
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8', marginBottom: 8 }}>
        Scheduled Actions
      </div>
      {data.actions.map((action, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < data.actions.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Wrench size={11} color="#94A3B8" />
            <span style={{ fontSize: 11, color: '#1E293B' }}>{action.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'monospace' }}>{action.due}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: '#22C55E', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1px 6px', borderRadius: 100 }}>{action.priority}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
