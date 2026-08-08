import { motion } from 'framer-motion';

/**
 * PageWrapper – wraps every page with consistent padding and fade-in animation.
 */
export function PageWrapper({ title, subtitle, icon, children, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        padding: '20px 24px',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Page header */}
      {title && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {icon && (
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3B82F6',
                flexShrink: 0,
              }}>
                {icon}
              </div>
            )}
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)', lineHeight: 1.2 }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2, fontFamily: 'var(--font-display)' }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
        </div>
      )}

      {children}
    </motion.div>
  );
}
