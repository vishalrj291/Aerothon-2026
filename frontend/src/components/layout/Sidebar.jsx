import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  Sliders,
  Activity,
  BarChart2,
  Info,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'MONITORING',
    items: [
      { to: '/',              icon: LayoutDashboard, label: 'Dashboard',        id: 'nav-dashboard' },
      { to: '/engine-health', icon: Activity,        label: 'Engine Health',    id: 'nav-health' },
    ],
  },
  {
    title: 'PREDICTION',
    items: [
      { to: '/prediction',   icon: Upload,          label: 'CSV Upload',       id: 'nav-prediction' },
      { to: '/manual',       icon: Sliders,         label: 'Manual Engine',    id: 'nav-manual' },
    ],
  },
  {
    title: 'ANALYSIS',
    items: [
      { to: '/analytics',    icon: BarChart2,       label: 'Analytics',        id: 'nav-analytics' },
      { to: '/model-info',   icon: Info,            label: 'Model Information',id: 'nav-model' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { to: '/reports',      icon: FileText,        label: 'Reports',          id: 'nav-reports' },
      { to: '/settings',     icon: Settings,        label: 'Settings',         id: 'nav-settings' },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        height: '100vh',
        background: 'var(--color-card)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px 12px',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Cpu size={16} color="#3B82F6" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                AeroTwin
              </div>
              <div style={{ fontSize: 9, color: '#3B82F6', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.1em' }}>
                V6 · DIGITAL TWIN
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 6px' }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} style={{ marginBottom: 16 }}>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--color-dim)',
                    padding: '0 6px',
                    marginBottom: 4,
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {section.title}
                </motion.div>
              )}
            </AnimatePresence>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                id={item.id}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
                style={{ marginBottom: 2 }}
              >
                <item.icon size={16} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden', whiteSpace: 'nowrap', fontSize: 13 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '8px 6px', borderTop: '1px solid var(--color-border)', flexShrink: 0 }}>
        <button
          id="sidebar-toggle"
          onClick={() => setCollapsed(c => !c)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            color: 'var(--color-muted)',
            transition: 'all 150ms ease',
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.aside>
  );
}
