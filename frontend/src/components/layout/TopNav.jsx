import { NavLink, useLocation } from 'react-router-dom';
import { Cpu, User, Bell, ChevronDown } from 'lucide-react';
import { useBackendStatus } from '../../hooks/useBackendStatus';

const NAV_LINKS = [
  { to: '/',            label: 'Dashboard',      end: true },
  { to: '/prediction',  label: 'Prediction' },
  { to: '/fleet',       label: 'Fleet' },
  { to: '/reports',     label: 'Reports' },
  { to: '/settings',    label: 'Settings' },
];

export function TopNav() {
  const { isOnline } = useBackendStatus();

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: 56,
      flexShrink: 0,
      zIndex: 50,
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#EFF6FF', border: '1px solid #BFDBFE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Cpu size={16} color="#2563EB" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.1, fontFamily: 'Inter, sans-serif' }}>
            AeroTwin
          </div>
          <div style={{ fontSize: 9, color: '#64748B', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>
            Digital Twin Operations Center
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#2563EB' : '#64748B',
              background: isActive ? '#EFF6FF' : 'transparent',
              textDecoration: 'none',
              transition: 'all 120ms ease',
              whiteSpace: 'nowrap',
            })}
            onMouseEnter={e => { if (!e.currentTarget.style.background || e.currentTarget.style.background === 'transparent') { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#1E293B'; }}}
            onMouseLeave={e => { if (e.currentTarget.getAttribute('data-active') !== 'true') { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Backend indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: isOnline ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${isOnline ? '#BBF7D0' : '#FECACA'}`, borderRadius: 100, fontSize: 11, fontWeight: 600, color: isOnline ? '#16A34A' : '#DC2626' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: isOnline ? '#22C55E' : '#EF4444', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          {isOnline === null ? 'Connecting' : isOnline ? 'Backend Online' : 'Backend Offline'}
        </div>

        {/* Notification */}
        <button style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', color: '#64748B' }}>
          <Bell size={15} />
          <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#EF4444', border: '1.5px solid #fff' }} />
        </button>

        {/* User */}
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px 5px 6px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={13} color="#2563EB" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1E293B' }}>Engineer</span>
          <ChevronDown size={12} color="#94A3B8" />
        </button>
      </div>
    </header>
  );
}
