/**
 * AeroTwin V6 – Realistic Aerospace Sample Data
 * Used for charts, fleet table, and KPI cards when no live prediction is available.
 */

// ── Fleet Engine Data (20 engines) ────────────────────────────
export const FLEET_DATA = [
  { id: 'ENG-001', tail: 'N737AT', cycle: 247, health: 94.2, rul: 312, risk: 'Low',    status: 'Nominal',  confidence: 96.1, compressor: 95.1, combustor: 93.8, turbine: 94.0 },
  { id: 'ENG-002', tail: 'N737BT', cycle: 389, health: 81.7, rul: 178, risk: 'Medium', status: 'Monitor',  confidence: 91.4, compressor: 80.2, combustor: 82.9, turbine: 81.1 },
  { id: 'ENG-003', tail: 'N737CT', cycle: 156, health: 97.8, rul: 380, risk: 'Low',    status: 'Nominal',  confidence: 97.3, compressor: 98.1, combustor: 97.4, turbine: 97.6 },
  { id: 'ENG-004', tail: 'N737DT', cycle: 467, health: 68.3, rul:  89, risk: 'High',   status: 'Alert',    confidence: 88.7, compressor: 65.4, combustor: 69.2, turbine: 68.8 },
  { id: 'ENG-005', tail: 'N737ET', cycle: 312, health: 88.9, rul: 234, risk: 'Low',    status: 'Nominal',  confidence: 94.2, compressor: 89.3, combustor: 88.4, turbine: 89.1 },
  { id: 'ENG-006', tail: 'N737FT', cycle: 198, health: 96.1, rul: 345, risk: 'Low',    status: 'Nominal',  confidence: 95.8, compressor: 96.8, combustor: 95.7, turbine: 96.0 },
  { id: 'ENG-007', tail: 'N737GT', cycle: 423, health: 74.6, rul: 124, risk: 'Medium', status: 'Monitor',  confidence: 89.3, compressor: 73.2, combustor: 75.1, turbine: 74.8 },
  { id: 'ENG-008', tail: 'N737HT', cycle:  78, health: 99.1, rul: 420, risk: 'Low',    status: 'Nominal',  confidence: 98.7, compressor: 99.3, combustor: 98.9, turbine: 99.0 },
  { id: 'ENG-009', tail: 'N737IT', cycle: 534, health: 62.4, rul:  67, risk: 'High',   status: 'Alert',    confidence: 86.2, compressor: 60.1, combustor: 63.8, turbine: 62.0 },
  { id: 'ENG-010', tail: 'N737JT', cycle: 267, health: 91.3, rul: 267, risk: 'Low',    status: 'Nominal',  confidence: 93.9, compressor: 92.0, combustor: 90.7, turbine: 91.5 },
  { id: 'ENG-011', tail: 'N737KT', cycle: 345, health: 85.7, rul: 198, risk: 'Low',    status: 'Nominal',  confidence: 92.4, compressor: 86.3, combustor: 85.1, turbine: 85.9 },
  { id: 'ENG-012', tail: 'N737LT', cycle: 412, health: 78.2, rul: 145, risk: 'Medium', status: 'Monitor',  confidence: 90.1, compressor: 77.8, combustor: 78.9, turbine: 78.0 },
  { id: 'ENG-013', tail: 'N737MT', cycle: 189, health: 95.4, rul: 358, risk: 'Low',    status: 'Nominal',  confidence: 96.5, compressor: 95.9, combustor: 95.2, turbine: 95.1 },
  { id: 'ENG-014', tail: 'N737NT', cycle: 456, health: 71.8, rul:  98, risk: 'High',   status: 'Alert',    confidence: 87.9, compressor: 70.4, combustor: 72.3, turbine: 71.6 },
  { id: 'ENG-015', tail: 'N737OT', cycle: 298, health: 89.7, rul: 245, risk: 'Low',    status: 'Nominal',  confidence: 94.6, compressor: 90.1, combustor: 89.3, turbine: 89.9 },
  { id: 'ENG-016', tail: 'N737PT', cycle: 134, health: 97.2, rul: 390, risk: 'Low',    status: 'Nominal',  confidence: 97.0, compressor: 97.8, combustor: 96.9, turbine: 97.0 },
  { id: 'ENG-017', tail: 'N737QT', cycle: 389, health: 82.4, rul: 178, risk: 'Medium', status: 'Monitor',  confidence: 91.8, compressor: 81.7, combustor: 83.1, turbine: 82.2 },
  { id: 'ENG-018', tail: 'N737RT', cycle: 223, health: 93.6, rul: 290, risk: 'Low',    status: 'Nominal',  confidence: 95.4, compressor: 94.2, combustor: 93.1, turbine: 93.8 },
  { id: 'ENG-019', tail: 'N737ST', cycle: 478, health: 66.8, rul:  78, risk: 'High',   status: 'Alert',    confidence: 87.1, compressor: 64.9, combustor: 67.5, turbine: 66.4 },
  { id: 'ENG-020', tail: 'N737TT', cycle: 167, health: 96.8, rul: 370, risk: 'Low',    status: 'Nominal',  confidence: 96.9, compressor: 97.1, combustor: 96.5, turbine: 96.9 },
];

// ── KPI Summaries ─────────────────────────────────────────────
export const KPI_SUMMARY = {
  fleetHealth:    { value: 87.4, delta: +2.1, unit: '%' },
  avgRUL:         { value: 186,  delta: -12,  unit: 'cycles' },
  avgConfidence:  { value: 93.2, delta: +0.4, unit: '%' },
  enginesProcessed:{ value: 20,  delta: +3,   unit: 'engines' },
};

// ── Health Trend (12 months) ──────────────────────────────────
export const HEALTH_TREND = [
  { period: 'Jan', health: 96.2, rul: 380, thrust: 87400, tsfc: 18.7, confidence: 95.1, compressor: 97.1, combustor: 95.8, turbine: 96.4 },
  { period: 'Feb', health: 95.8, rul: 365, thrust: 87100, tsfc: 18.9, confidence: 94.8, compressor: 96.7, combustor: 95.4, turbine: 96.0 },
  { period: 'Mar', health: 95.1, rul: 348, thrust: 86800, tsfc: 19.1, confidence: 94.5, compressor: 95.9, combustor: 94.9, turbine: 95.3 },
  { period: 'Apr', health: 94.3, rul: 332, thrust: 86400, tsfc: 19.3, confidence: 94.1, compressor: 95.1, combustor: 94.0, turbine: 94.6 },
  { period: 'May', health: 93.7, rul: 316, thrust: 86100, tsfc: 19.5, confidence: 93.8, compressor: 94.5, combustor: 93.4, turbine: 93.9 },
  { period: 'Jun', health: 92.8, rul: 298, thrust: 85700, tsfc: 19.7, confidence: 93.4, compressor: 93.6, combustor: 92.5, turbine: 93.0 },
  { period: 'Jul', health: 91.9, rul: 278, thrust: 85300, tsfc: 19.9, confidence: 93.1, compressor: 92.7, combustor: 91.6, turbine: 92.1 },
  { period: 'Aug', health: 91.0, rul: 258, thrust: 84900, tsfc: 20.1, confidence: 93.0, compressor: 91.8, combustor: 90.7, turbine: 91.2 },
  { period: 'Sep', health: 90.1, rul: 238, thrust: 84600, tsfc: 20.1, confidence: 93.2, compressor: 90.9, combustor: 89.8, turbine: 90.3 },
  { period: 'Oct', health: 89.2, rul: 218, thrust: 84300, tsfc: 20.2, confidence: 93.3, compressor: 89.9, combustor: 88.9, turbine: 89.4 },
  { period: 'Nov', health: 88.3, rul: 201, thrust: 84100, tsfc: 20.2, confidence: 93.2, compressor: 88.9, combustor: 88.0, turbine: 88.5 },
  { period: 'Dec', health: 87.4, rul: 186, thrust: 83800, tsfc: 20.3, confidence: 93.2, compressor: 88.0, combustor: 87.1, turbine: 87.6 },
];

// ── Default engine component health (for schematic) ───────────
export const DEFAULT_COMPONENT_HEALTH = {
  compressor: 88.0,
  combustor:  87.1,
  turbine:    87.6,
  nozzle:     94.2,
};

// ── RUL data ──────────────────────────────────────────────────
export const RUL_DATA = {
  current:          247,
  remaining:        186,
  max:              500,
  threshold:        50,
  predictedFailure: 433,
};

// ── Maintenance ───────────────────────────────────────────────
export const MAINTENANCE_DATA = {
  status:         'Healthy',
  risk:           'Low',
  recommendation: 'Continue normal operation',
  nextInspection: 150,
  notes:          'No abnormal degradation detected. Compressor efficiency within nominal bounds. Turbine inlet temperature stable.',
  actions: [
    { label: 'Borescope inspection', due: 'Cycle 397 (+150)', priority: 'Routine' },
    { label: 'Vibration analysis',   due: 'Cycle 350 (+103)', priority: 'Routine' },
    { label: 'Oil sample analysis',  due: 'Cycle 290 (+43)',  priority: 'Routine' },
  ],
};

// ── Prediction Timeline steps ──────────────────────────────────
export const TIMELINE_STEPS = [
  { id: 1, label: 'CSV Uploaded',              status: 'done',    time: '14:32:01' },
  { id: 2, label: 'Schema Validation',         status: 'done',    time: '14:32:02' },
  { id: 3, label: 'Physics Feature Engineering', status: 'done', time: '14:32:04' },
  { id: 4, label: 'Health Prediction',         status: 'done',    time: '14:32:07' },
  { id: 5, label: 'Confidence Estimation',     status: 'done',    time: '14:32:08' },
  { id: 6, label: 'Health Prognostics',        status: 'done',    time: '14:32:09' },
  { id: 7, label: 'RUL Estimation',            status: 'done',    time: '14:32:11' },
  { id: 8, label: 'Maintenance Analysis',      status: 'done',    time: '14:32:12' },
  { id: 9, label: 'Completed',                 status: 'done',    time: '14:32:13' },
];

// ── System info ────────────────────────────────────────────────
export const SYSTEM_INFO = {
  models: [
    { name: 'XGBoost', target: 'Overall Health',    status: 'active', r2: 0.974 },
    { name: 'XGBoost', target: 'Compressor Health', status: 'active', r2: 0.968 },
    { name: 'XGBoost', target: 'Combustor Health',  status: 'active', r2: 0.961 },
    { name: 'XGBoost', target: 'Turbine Health',    status: 'active', r2: 0.971 },
    { name: 'XGBoost', target: 'Thrust',            status: 'active', r2: 0.989 },
    { name: 'XGBoost', target: 'TSFC',              status: 'active', r2: 0.981 },
  ],
  physicsEngine:   true,
  validationActive: true,
  prognosticsActive: true,
  inferenceTimeMs: 42,
  lastUpdated: '2026-08-08T06:32:00Z',
};
