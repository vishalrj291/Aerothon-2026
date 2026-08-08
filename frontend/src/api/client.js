/**
 * AeroTwin V6 – API Client
 * All backend communication goes through this module.
 * Endpoints: GET /, GET /health, GET /model-info,
 *             POST /predict/csv, POST /predict/single,
 *             GET /download/latest
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// ──────────────────────────────────────────────────────────
// Health
// ──────────────────────────────────────────────────────────
export const fetchHealth = async () => {
  const res = await client.get('/health');
  return res.data;
  // returns { status, models_loaded, loaded_models }
};

// ──────────────────────────────────────────────────────────
// Root info
// ──────────────────────────────────────────────────────────
export const fetchRoot = async () => {
  const res = await client.get('/');
  return res.data;
  // returns { Project, Version, Status }
};

// ──────────────────────────────────────────────────────────
// Model Info
// ──────────────────────────────────────────────────────────
export const fetchModelInfo = async () => {
  const res = await client.get('/model-info');
  return res.data;
  /*
    returns {
      Project, Version, PhysicsGuided, Targets, TargetNames,
      Models: {
        [target]: { BestModel, R2, RMSE, MAE, MAPE, FeatureCount }
      }
    }
  */
};

// ──────────────────────────────────────────────────────────
// Single Prediction
// ──────────────────────────────────────────────────────────
export const predictSingle = async (payload) => {
  // payload must match PredictionRequest schema
  const res = await client.post('/predict/single', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
  // returns { success, prediction: PredictionResponse }
};

// ──────────────────────────────────────────────────────────
// CSV Prediction
// ──────────────────────────────────────────────────────────
export const predictCSV = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await client.post('/predict/csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });
  return res.data;
  // returns { success, rows, predictions: PredictionResponse[] }
};

// ──────────────────────────────────────────────────────────
// Download Latest Prediction
// ──────────────────────────────────────────────────────────
export const getDownloadURL = () => `${BASE_URL}/download/latest`;

export default client;
