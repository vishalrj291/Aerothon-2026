import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Play, Clock, FileText, Download,
  CheckCircle, AlertCircle, Loader2, X,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

function HistoryItem({ item, index }) {
  const health = item.OverallHealth ?? item.prediction?.OverallHealth ?? 0;
  const color = health >= 80 ? '#22C55E' : health >= 60 ? '#F59E0B' : '#EF4444';
  const ts = item._timestamp ? new Date(item._timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: '#1E293B', fontFamily: 'Inter' }}>Run #{index + 1}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: color, fontWeight: 700, fontFamily: 'monospace' }}>{health.toFixed(1)}%</span>
        <span style={{ fontSize: 10, color: '#94A3B8' }}>{ts}</span>
      </div>
    </div>
  );
}

export function ControlSidebar() {
  const { loading, error, history, runCSVPrediction, clearError } = useAppContext();
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f || !f.name.endsWith('.csv')) return;
    setFile(f);
    clearError?.();
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleRun = async () => {
    if (!file) return;
    setProgress(0);
    try { await runCSVPrediction(file); }
    catch { /* handled in context */ }
  };

  const recentHistory = history.slice(0, 5);

  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      background: '#fff',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      overflowY: 'auto',
      height: '100%',
    }}>
      {/* Upload Section */}
      <div style={{ padding: '16px 14px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: 10 }}>
          Upload Dataset
        </div>

        {/* Drop zone */}
        <div
          className={`ae-drop-zone${dragging ? ' drag-active' : ''}`}
          style={{ padding: '18px 12px', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <FileText size={20} color="#22C55E" />
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1E293B', wordBreak: 'break-all', lineHeight: 1.3 }}>{file.name}</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>{(file.size / 1024).toFixed(1)} KB</div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#94A3B8' }}>
                  <X size={10} /> Remove
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Upload size={20} color="#2563EB" />
                <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
                  Drop CSV here<br />or click to browse
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Browse + Sample CSV */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <button
            className="ae-btn-secondary"
            style={{ flex: 1, fontSize: 11, padding: '6px 8px', justifyContent: 'center' }}
            onClick={() => fileRef.current?.click()}
          >
            Browse
          </button>
          <a
            href="/sample_data.csv"
            download
            className="ae-btn-secondary"
            style={{ flex: 1, fontSize: 11, padding: '6px 8px', justifyContent: 'center', textAlign: 'center' }}
          >
            <Download size={11} /> Sample
          </a>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginTop: 8, padding: '7px 10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <AlertCircle size={12} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 10, color: '#DC2626', lineHeight: 1.4 }}>{error}</div>
          </div>
        )}
      </div>

      {/* Run Digital Twin */}
      <div style={{ padding: '14px 14px', borderBottom: '1px solid #E2E8F0' }}>
        <button
          id="run-dt-btn"
          className="ae-btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 13 }}
          disabled={!file || loading}
          onClick={handleRun}
        >
          {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={14} />}
          {loading ? 'Processing...' : 'Run Digital Twin'}
        </button>
      </div>

      {/* Prediction History */}
      <div style={{ padding: '14px 14px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8' }}>
            Prediction History
          </div>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>{history.length} runs</div>
        </div>

        {recentHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 11, color: '#94A3B8' }}>
            No predictions yet
          </div>
        ) : (
          recentHistory.map((item, i) => (
            <HistoryItem key={i} item={item} index={i} />
          ))
        )}
      </div>
    </aside>
  );
}
