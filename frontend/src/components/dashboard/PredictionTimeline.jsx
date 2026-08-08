import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { TIMELINE_STEPS } from '../../data/sampleData';

export function PredictionTimeline({ steps, loading }) {
  const displaySteps = steps ?? TIMELINE_STEPS;

  return (
    <div className="ae-card" style={{ padding: '20px 22px' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Prediction Pipeline</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>Digital twin inference workflow</div>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Vertical connector line */}
        <div style={{
          position: 'absolute',
          left: 14,
          top: 28,
          bottom: 28,
          width: 2,
          background: '#E2E8F0',
          zIndex: 0,
        }} />

        {displaySteps.map((step, i) => {
          const isDone    = step.status === 'done';
          const isActive  = step.status === 'active';
          const isPending = step.status === 'pending';

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                position: 'relative',
                zIndex: 1,
                marginBottom: i < displaySteps.length - 1 ? 8 : 0,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 28, height: 28,
                borderRadius: '50%',
                background: isDone ? '#F0FDF4' : isActive ? '#EFF6FF' : '#F8FAFC',
                border: `2px solid ${isDone ? '#22C55E' : isActive ? '#2563EB' : '#E2E8F0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {isDone    && <CheckCircle size={13} color="#22C55E" />}
                {isActive  && <Loader2 size={13} color="#2563EB" style={{ animation: 'spin 1s linear infinite' }} />}
                {isPending && <Circle size={8} color="#CBD5E1" />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: 4, paddingBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: isDone ? 600 : 500,
                    color: isDone ? '#1E293B' : isActive ? '#2563EB' : '#94A3B8',
                  }}>
                    {step.label}
                  </span>
                  {step.time && isDone && (
                    <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>{step.time}</span>
                  )}
                  {isActive && (
                    <span style={{ fontSize: 10, color: '#2563EB', fontWeight: 600 }}>Running...</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{ marginTop: 14, padding: '8px 12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 5 }}>
          <CheckCircle size={12} />
          Pipeline completed in 12s · 9 stages
        </div>
      </div>
    </div>
  );
}
