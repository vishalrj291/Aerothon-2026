/**
 * SectionLabel – titled section divider with accent bar.
 */
export function SectionLabel({ children, icon, action }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 3, height: 16, background: '#3B82F6', borderRadius: 2 }} />
        {icon && <span style={{ color: '#3B82F6', display: 'flex', fontSize: 14 }}>{icon}</span>}
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--color-muted)',
          fontFamily: 'var(--font-display)',
        }}>
          {children}
        </span>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * CardHeader – standard panel header with title and optional right slot.
 */
export function CardHeader({ title, icon, right, badge }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span style={{ color: '#3B82F6', display: 'flex', fontSize: 15 }}>{icon}</span>}
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-display)',
        }}>
          {title}
        </span>
        {badge}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
