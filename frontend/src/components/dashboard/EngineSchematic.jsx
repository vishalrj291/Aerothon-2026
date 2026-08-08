import { useState } from 'react';
import { DEFAULT_COMPONENT_HEALTH } from '../../data/sampleData';

// ==========================================================
// NORMALIZATION
// ==========================================================

function toPercentage(value) {

  const n = Number(value);

  if (!Number.isFinite(n)) {
    return 0;
  }

  if (n >= 0 && n <= 1) {
    return n * 100;
  }

  return n;
}

// ==========================================================
// COLOR
// ==========================================================

function healthColor(value) {

  const v = toPercentage(value);

  if (v >= 90) {

    return {
      fill: '#F0FDF4',
      stroke: '#22C55E',
      text: '#16A34A',
      label: 'Excellent',
    };

  }

  if (v >= 75) {

    return {
      fill: '#ECFDF5',
      stroke: '#6EE7B7',
      text: '#059669',
      label: 'Good',
    };

  }

  if (v >= 60) {

    return {
      fill: '#FFFBEB',
      stroke: '#F59E0B',
      text: '#D97706',
      label: 'Fair',
    };

  }

  return {

    fill: '#FEF2F2',

    stroke: '#EF4444',

    text: '#DC2626',

    label: 'Poor',

  };
}

// ==========================================================
// TOOLTIP
// ==========================================================

function Tooltip({
  x,
  y,
  data,
  visible,
}) {

  if (!visible || !data) {
    return null;
  }

  const c = healthColor(
    data.health
  );

  return (

    <g>

      <foreignObject
        x={x - 70}
        y={y - 90}
        width={140}
        height={85}
        style={{
          overflow: 'visible',
        }}
      >

        <div
          style={{
            background: '#fff',
            border:
              `1.5px solid ${c.stroke}`,
            borderRadius: 8,
            padding: '8px 12px',
            boxShadow:
              '0 4px 16px rgba(0,0,0,0.12)',
            fontSize: 11,
            fontFamily:
              'Inter, sans-serif',
            pointerEvents: 'none',
          }}
        >

          <div
            style={{
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: 4,
            }}
          >
            {data.name}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 3,
            }}
          >

            <span
              style={{
                color: '#64748B',
              }}
            >
              Health
            </span>

            <span
              style={{
                fontWeight: 700,
                color: c.text,
                fontFamily: 'monospace',
              }}
            >
              {toPercentage(
                data.health
              ).toFixed(1)}
              %
            </span>

          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 3,
            }}
          >

            <span
              style={{
                color: '#64748B',
              }}
            >
              Confidence
            </span>

            <span
              style={{
                fontWeight: 600,
                color: '#1E293B',
                fontFamily: 'monospace',
              }}
            >
              {toPercentage(
                data.confidence
              ).toFixed(1)}
              %
            </span>

          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >

            <span
              style={{
                color: '#64748B',
              }}
            >
              Status
            </span>

            <span
              style={{
                fontWeight: 700,
                color: c.text,
              }}
            >
              {c.label}
            </span>

          </div>

        </div>

      </foreignObject>

    </g>
  );
}

// ==========================================================
// BLADE LINES
// ==========================================================

function BladeLines({
  x,
  y,
  width,
  height,
  count = 6,
  color = '#94A3B8',
}) {

  const lines = [];

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const lx =
      x +
      (width / (count + 1)) *
        (i + 1);

    lines.push(

      <line
        key={i}
        x1={lx}
        y1={y + 4}
        x2={lx}
        y2={y + height - 4}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

    );

  }

  return <g>{lines}</g>;
}

// ==========================================================
// MAIN COMPONENT
// ==========================================================

export function EngineSchematic({
  health,
  confidence,
}) {

  const h = {
    ...DEFAULT_COMPONENT_HEALTH,
    ...health,
  };

  const conf = confidence || {};

  const [
    tooltip,
    setTooltip,
  ] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  const components = [

    {
      id: 'compressor',

      name: 'Compressor',

      health:
        h.compressor ?? 0,

      confidence:
        conf.compressor ?? 0,

      x: 90,
      y: 28,
      width: 190,
      height: 114,

      blades: 8,

      label:
        'LP/HP Compressor',
    },

    {
      id: 'combustor',

      name: 'Combustor',

      health:
        h.combustor ?? 0,

      confidence:
        conf.combustor ?? 0,

      x: 290,
      y: 14,
      width: 160,
      height: 142,

      blades: 0,

      label:
        'Combustion Chamber',
    },

    {
      id: 'turbine',

      name: 'Turbine',

      health:
        h.turbine ?? 0,

      confidence:
        conf.turbine ?? 0,

      x: 460,
      y: 28,
      width: 160,
      height: 114,

      blades: 6,

      label:
        'HP/LP Turbine',
    },

    {
      id: 'nozzle',

      name: 'Nozzle',

      health:
        h.nozzle ?? 0,

      confidence:
        conf.nozzle ?? 0,

      x: 630,
      y: 44,
      width: 90,
      height: 82,

      blades: 0,

      label:
        'Exhaust Nozzle',
    },

  ];

  const handleEnter = (
    component
  ) => {

    const midX =
      component.x +
      component.width / 2;

    const midY =
      component.y;

    setTooltip({

      visible: true,

      x: midX,

      y: midY,

      data: component,

    });

  };

  const handleLeave = () => {

    setTooltip(
      (current) => ({
        ...current,
        visible: false,
      })
    );

  };

  return (

    <div
      className="ae-card"
      style={{
        padding: '20px 22px',
      }}
    >

      {/* Header */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          marginBottom: 16,
        }}
      >

        <div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#1E293B',
            }}
          >
            Engine Health Schematic
          </div>

          <div
            style={{
              fontSize: 11,
              color: '#94A3B8',
            }}
          >
            Hover over components for
            detailed health metrics
          </div>

        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
          }}
        >

          {[
            {
              color: '#22C55E',
              label:
                '≥90% Excellent',
            },
            {
              color: '#F59E0B',
              label:
                '75–89% Good',
            },
            {
              color: '#EF4444',
              label:
                '<75% Alert',
            },
          ].map((item) => (

            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >

              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background:
                    item.color,
                }}
              />

              <span
                style={{
                  fontSize: 10,
                  color: '#64748B',
                }}
              >
                {item.label}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* SVG */}

      <svg
        viewBox="0 0 760 180"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
        role="img"
        aria-label="Turbojet engine schematic"
      >

        {/* Engine casing */}

        <path
          d="M 30 50 L 90 28 L 630 28 L 720 55 L 730 85 L 720 95"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M 30 130 L 90 142 L 630 142 L 720 125 L 730 95 L 720 95"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Inlet */}

        <path
          d="M 20 85 L 30 50 L 30 130 Z"
          fill="#F8FAFC"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        <path
          d="M 10 85 L 30 65 L 30 105 Z"
          fill="#F1F5F9"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        <ellipse
          cx="28"
          cy="85"
          rx="7"
          ry="14"
          fill="#E2E8F0"
          stroke="#CBD5E1"
          strokeWidth="1"
        />

        {/* Shaft */}

        <line
          x1="30"
          y1="85"
          x2="720"
          y2="85"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Components */}

        {components.map(
          (component) => {

            const c =
              healthColor(
                component.health
              );

            const healthValue =
              toPercentage(
                component.health
              );

            const confidenceValue =
              toPercentage(
                component.confidence
              );

            return (

              <g
                key={component.id}
                style={{
                  cursor: 'pointer',
                }}
                onMouseEnter={() =>
                  handleEnter(
                    component
                  )
                }
                onMouseLeave={
                  handleLeave
                }
              >

                {/* Body */}

                <rect
                  x={component.x}
                  y={component.y}
                  width={
                    component.width
                  }
                  height={
                    component.height
                  }
                  rx={6}
                  fill={c.fill}
                  stroke={c.stroke}
                  strokeWidth={2}
                  style={{
                    transition:
                      'all 0.3s ease',
                  }}
                />

                {/* Blades */}

                {component.blades > 0 && (

                  <BladeLines
                    x={component.x}
                    y={component.y}
                    width={
                      component.width
                    }
                    height={
                      component.height
                    }
                    count={
                      component.blades
                    }
                    color={
                      c.stroke
                    }
                  />

                )}

                {/* Combustor */}

                {component.id ===
                  'combustor' && (

                  <>

                    <ellipse
                      cx={
                        component.x +
                        component.width /
                          2
                      }
                      cy={
                        component.y +
                        component.height /
                          2
                      }
                      rx={28}
                      ry={38}
                      fill={c.stroke}
                      fillOpacity="0.12"
                      stroke={
                        c.stroke
                      }
                      strokeWidth="1"
                      strokeDasharray="3 2"
                    />

                    <ellipse
                      cx={
                        component.x +
                        component.width /
                          2
                      }
                      cy={
                        component.y +
                        component.height /
                          2
                      }
                      rx={14}
                      ry={20}
                      fill={c.stroke}
                      fillOpacity="0.2"
                    />

                  </>

                )}

                {/* Nozzle */}

                {component.id ===
                  'nozzle' && (

                  <>

                    <line
                      x1={
                        component.x
                      }
                      y1={
                        component.y +
                        component.height /
                          2 -
                        20
                      }
                      x2={
                        component.x +
                        component.width
                      }
                      y2={
                        component.y +
                        component.height /
                          2 -
                        6
                      }
                      stroke={
                        c.stroke
                      }
                      strokeWidth="1"
                      strokeOpacity="0.5"
                    />

                    <line
                      x1={
                        component.x
                      }
                      y1={
                        component.y +
                        component.height /
                          2 +
                        20
                      }
                      x2={
                        component.x +
                        component.width
                      }
                      y2={
                        component.y +
                        component.height /
                          2 +
                        6
                      }
                      stroke={
                        c.stroke
                      }
                      strokeWidth="1"
                      strokeOpacity="0.5"
                    />

                  </>

                )}

                {/* Health */}

                <text
                  x={
                    component.x +
                    component.width / 2
                  }
                  y={
                    component.y +
                    component.height / 2 -
                    4
                  }
                  textAnchor="middle"
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily:
                      'JetBrains Mono, monospace',
                    fill: c.text,
                    pointerEvents:
                      'none',
                  }}
                >
                  {healthValue.toFixed(0)}%
                </text>

                {/* Component */}

                <text
                  x={
                    component.x +
                    component.width / 2
                  }
                  y={
                    component.y +
                    component.height / 2 +
                    14
                  }
                  textAnchor="middle"
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    fontFamily:
                      'Inter, sans-serif',
                    fill: c.text,
                    letterSpacing:
                      '0.06em',
                    pointerEvents:
                      'none',
                  }}
                >
                  {component.id.toUpperCase()}
                </text>

                {/* Label */}

                <text
                  x={
                    component.x +
                    component.width / 2
                  }
                  y={
                    component.y +
                    component.height +
                    14
                  }
                  textAnchor="middle"
                  style={{
                    fontSize: 9,
                    fill: '#94A3B8',
                    fontFamily:
                      'Inter, sans-serif',
                    pointerEvents:
                      'none',
                  }}
                >
                  {component.label}
                </text>

              </g>

            );

          }
        )}

        {/* Nozzle exit */}

        <path
          d="M 720 55 L 745 75 L 745 95 L 720 95"
          fill="#F8FAFC"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        <path
          d="M 720 125 L 745 105 L 745 95"
          fill="#F8FAFC"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {/* Exhaust */}

        <path
          d="M 748 82 L 758 85 L 748 88"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <path
          d="M 752 75 L 762 78 L 752 81"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        <path
          d="M 752 89 L 762 92 L 752 95"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Section dividers */}

        {[90, 290, 460, 630].map(
          (xPos) => (

            <line
              key={xPos}
              x1={xPos}
              y1={10}
              x2={xPos}
              y2={160}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="2 3"
            />

          )
        )}

        <Tooltip
          {...tooltip}
        />

      </svg>

    </div>
  );
}