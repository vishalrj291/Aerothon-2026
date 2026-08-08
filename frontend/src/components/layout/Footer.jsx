export function Footer() {
  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid #E2E8F0',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>AeroTwin</div>
        <div style={{ width: 1, height: 12, background: '#E2E8F0' }} />
        <div style={{ fontSize: 11, color: '#64748B' }}>V6 · Physics-Guided Digital Twin</div>
        <div style={{ width: 1, height: 12, background: '#E2E8F0' }} />
        <div style={{ fontSize: 11, color: '#94A3B8' }}>Designed for Aerospace Predictive Maintenance</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>© 2026 AeroTwin</span>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>API v6.0</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#22C55E', fontWeight: 600 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
          All Systems Nominal
        </div>
      </div>
    </footer>
  );
}
