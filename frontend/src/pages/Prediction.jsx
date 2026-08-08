import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, X, CheckCircle, AlertCircle,
  Download, Loader2, Play, RotateCcw,
} from 'lucide-react';
import {
  useAppContext,
  toPercentage,
  healthPercentage,
} from '../context/AppContext';
import { getDownloadURL } from '../api/client';
import { FleetTable } from '../components/dashboard/FleetTable';
import { PredictionTimeline } from '../components/dashboard/PredictionTimeline';

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{title}</h1>
      {sub && <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>{sub}</p>}
    </div>
  );
}

function StatCard({ label, value, unit, color = '#2563EB' }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
        {value ?? '—'}
        {unit && <span style={{ fontSize: 13, color: '#94A3B8', marginLeft: 4, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{unit}</span>}
      </div>
    </div>
  );
}

export default function Prediction() {
  const { loading, error, csvResult, runCSVPrediction, clearError } = useAppContext();
  const [file, setFile]      = useState(null);
  const [dragging, setDrag]  = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f || !f.name.endsWith('.csv')) return;
    setFile(f);
    clearError?.();
    setProgress(0);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleReset = () => { setFile(null); setProgress(0); clearError?.(); };

  const handlePredict = async () => {
    if (!file) return;
    try { await runCSVPrediction(file); }
    catch { /* handled in context */ }
  };

  const predictions = csvResult?.predictions ?? [];
  const avgHealth = predictions.length
  ? (
      predictions.reduce(
        (sum, row) =>
          sum + healthPercentage(row.OverallHealth),
        0
      ) / predictions.length
    ).toFixed(1)
  : null;

const avgConf = predictions.length
  ? (
      predictions.reduce(
        (sum, row) =>
          sum + toPercentage(row.OverallHealth_Confidence),
        0
      ) / predictions.length
    ).toFixed(1)
  : null;

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <SectionTitle
        title="CSV Batch Prediction"
        sub="Upload engine sensor data for multi-engine health assessment and RUL estimation"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Left: Upload card */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Upload Engine Data</div>

            {/* Drop zone */}
            <div
              className={`ae-drop-zone${dragging ? ' drag-active' : ''}`}
              style={{ padding: '36px 24px', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
            >
              <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div key="file" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={22} color="#22C55E" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{file.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{(file.size / 1024).toFixed(1)} KB · CSV</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); handleReset(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94A3B8' }}>
                      <X size={11} /> Remove
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload size={22} color="#2563EB" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>Drop your CSV file here</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>or click to browse · .csv files only</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress */}
            {loading && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Processing...</span>
                  <span style={{ fontSize: 11, color: '#2563EB', fontFamily: 'monospace', fontWeight: 700 }}>{progress}%</span>
                </div>
                <div className="ae-progress-track">
                  <motion.div className="ae-progress-fill" style={{ background: '#2563EB', width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, display: 'flex', gap: 8 }}>
                <AlertCircle size={14} color="#DC2626" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: '#DC2626', lineHeight: 1.5 }}>{error}</div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button id="csv-predict-btn" className="ae-btn-primary" disabled={!file || loading} onClick={handlePredict} style={{ flex: 1, justifyContent: 'center', padding: 11 }}>
                {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={14} />}
                {loading ? 'Running Digital Twin...' : 'Run Batch Prediction'}
              </button>
              {csvResult && (
                <a id="csv-download-btn" href={getDownloadURL()} download="AeroTwin_Predictions.csv" className="ae-btn-secondary" style={{ padding: '11px 16px', textDecoration: 'none' }}>
                  <Download size={14} /> Download
                </a>
              )}
            </div>
          </div>

          {/* Results */}
          <AnimatePresence>
            {csvResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Summary stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
                  <StatCard label="Rows Processed" value={csvResult.rows} unit="" color="#2563EB" />
                  <StatCard label="Avg Overall Health" value={avgHealth} unit="%" color="#22C55E" />
                  <StatCard label="Avg Confidence" value={avgConf} unit="%" color="#7C3AED" />
                </div>

                {/* Results table */}
                <FleetTable predictions={predictions.map((r, i) => ({
                  id: r.EngineID ? `ENG-${String(r.EngineID).padStart(3, '0')}` : `ROW-${i+1}`,
                  cycle: r.Cycle ?? i+1,
                  health: r.OverallHealth ?? 0,
                  rul: 186,
                  risk: r.OverallHealth >= 80 ? 'Low' : r.OverallHealth >= 60 ? 'Medium' : 'High',
                  status: r.OverallHealth >= 80 ? 'Nominal' : r.OverallHealth >= 60 ? 'Monitor' : 'Alert',
                  confidence: (r.OverallHealth_Confidence ?? 0.93) * 100,
                }))} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Timeline */}
        <div style={{ position: 'sticky', top: 20 }}>
          <PredictionTimeline />
          <div style={{ marginTop: 14 }}>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 10 }}>Required CSV Columns</div>
              {['EngineID', 'Cycle', 'Altitude_m', 'Mach', 'Tamb_K', 'Pamb_Pa', 'RPM_rev_min', 'FuelFlow_kg_s', 'P2_Pa', 'T2_K', 'P3_Pa', 'T3_K', 'P4_Pa', 'T4_K'].map(col => (
                <div key={col} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid #F8FAFC' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#1E293B' }}>{col}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
