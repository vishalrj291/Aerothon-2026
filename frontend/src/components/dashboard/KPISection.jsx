import { motion } from 'framer-motion';
import {
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
} from 'lucide-react';

import { KPI_SUMMARY } from '../../data/sampleData';

// ==========================================================
// VALUE NORMALIZATION
// ==========================================================

function toPercentage(value) {
  const n = Number(value);

  if (!Number.isFinite(n)) {
    return 0;
  }

  // Backend may return 0.95
  if (n >= 0 && n <= 1) {
    return n * 100;
  }

  // Backend may already return 95
  return n;
}

// ==========================================================
// TREND
// ==========================================================

function TrendIndicator({ delta, unit = '' }) {

  if (delta == null) return null;

  const isPos = delta > 0;

  const isHealth = unit === '%';

  const isGood = isHealth
    ? isPos
    : !isPos;

  const color =
    delta === 0
      ? '#94A3B8'
      : isGood
        ? '#22C55E'
        : '#EF4444';

  const Icon = isPos
    ? TrendingUp
    : TrendingDown;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        color,
      }}
    >

      <Icon size={13} />

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {isPos ? '+' : ''}
        {delta}
        {' '}
        {unit}
        {' '}
        from last run
      </span>

    </div>
  );
}

// ==========================================================
// KPI CARD
// ==========================================================

function KPICard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  unit,
  delta,
  subtitle,
  delay,
}) {

  return (

    <motion.div
      className="ae-card"
      style={{
        padding: '20px 22px',
      }}

      initial={{
        opacity: 0,
        y: 12,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        delay,
        duration: 0.35,
      }}
    >

      {/* Header */}

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            lineHeight: 1.3,
          }}
        >
          {label}
        </div>

        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon
            size={18}
            color={iconColor}
          />
        </div>

      </div>

      {/* Value */}

      <div
        style={{
          marginBottom: 6,
        }}
      >

        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#1E293B',
            fontFamily: 'JetBrains Mono, monospace',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>

        {unit && (
          <span
            style={{
              fontSize: 14,
              color: '#64748B',
              marginLeft: 5,
              fontWeight: 500,
            }}
          >
            {unit}
          </span>
        )}

      </div>

      {/* Subtitle */}

      {subtitle && (
        <div
          style={{
            fontSize: 11,
            color: '#94A3B8',
            marginBottom: 6,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Trend */}

      <TrendIndicator
        delta={delta}
        unit={unit}
      />

    </motion.div>
  );
}

// ==========================================================
// MAIN
// ==========================================================

export function KPISection({
  latestPrediction,
  summary,
}) {

  const pred = latestPrediction;

  const kpi = KPI_SUMMARY;

  // --------------------------------------------------------
  // HEALTH
  // --------------------------------------------------------

  const health = pred
    ? toPercentage(pred.OverallHealth)
    : toPercentage(kpi.fleetHealth.value);

  // --------------------------------------------------------
  // CONFIDENCE
  // --------------------------------------------------------

  const confidence = pred
    ? toPercentage(
        pred.OverallHealth_Confidence
      )
    : toPercentage(
        kpi.avgConfidence.value
      );

  // --------------------------------------------------------
  // RUL
  // --------------------------------------------------------

  const rul = pred?.EstimatedRUL;

  // --------------------------------------------------------
  // ENGINE COUNT
  // --------------------------------------------------------

  const engineCount =
    summary?.TotalEngines ??
    kpi.enginesProcessed.value;

  const cards = [

    // ======================================================
    // HEALTH
    // ======================================================

    {
      icon: Shield,

      iconBg: '#EFF6FF',

      iconColor: '#2563EB',

      label: 'Overall Fleet Health',

      value: health.toFixed(1),

      unit: '%',

      delta: pred
        ? null
        : kpi.fleetHealth.delta,

      subtitle:
        'Physics-guided health index',

      delay: 0,
    },

    // ======================================================
    // RUL
    // ======================================================

    {
      icon: Clock,

      iconBg: '#FFFBEB',

      iconColor: '#F59E0B',

      label: 'Estimated RUL',

      value:
        rul != null
          ? Number(rul).toFixed(0)
          : summary?.AverageRUL != null
            ? Number(summary.AverageRUL).toFixed(0)
            : '—',

      unit: 'cycles',

      delta: null,

      subtitle:
        'Remaining useful life estimate',

      delay: 0.05,
    },

    // ======================================================
    // CONFIDENCE
    // ======================================================

    {
      icon: Activity,

      iconBg: '#F0FDF4',

      iconColor: '#22C55E',

      label: 'Prediction Confidence',

      value: confidence.toFixed(1),

      unit: '%',

      delta: pred
        ? null
        : kpi.avgConfidence.delta,

      subtitle:
        'Mean model confidence score',

      delay: 0.1,
    },

    // ======================================================
    // ENGINES
    // ======================================================

    {
      icon: Layers,

      iconBg: '#FAF5FF',

      iconColor: '#7C3AED',

      label: 'Engines Processed',

      value: engineCount,

      unit: '',

      delta: kpi.enginesProcessed.delta,

      subtitle:
        'Total in current session',

      delay: 0.15,
    },

  ];

  return (

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 16,
      }}
    >

      {cards.map((card) => (

        <KPICard
          key={card.label}
          {...card}
        />

      ))}

    </div>
  );
}