import { createContext, useContext, useState, useCallback } from 'react';
import { predictSingle, predictCSV } from '../api/client';

const AppContext = createContext(null);

/*
 * Convert any confidence value to a safe 0-100 percentage.
 *
 * Backend may return:
 *   0.95  -> 95%
 *   95    -> 95%
 *
 * This prevents:
 *   95 -> 9500%
 */
export function toPercentage(value, fallback = 0) {
  const n = Number(value);

  if (!Number.isFinite(n)) {
    return fallback;
  }

  const percentage = n <= 1 ? n * 100 : n;

  return Math.max(0, Math.min(100, percentage));
}

/*
 * Health values are expected to normally be:
 *   0.95 -> 95%
 *   95   -> 95%
 *
 * Keeps the frontend robust against either representation.
 */
export function healthPercentage(value, fallback = 0) {
  return toPercentage(value, fallback);
}

export function AppProvider({ children }) {

  const [latestPrediction, setLatestPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [csvResult, setCsvResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================================
  // SINGLE PREDICTION
  // ==========================================================

  const runSinglePrediction = useCallback(async (payload) => {

    setLoading(true);
    setError(null);

    try {

      const data = await predictSingle(payload);

      const prediction = data.prediction;

      const enrichedPrediction = {
        ...prediction,
        _timestamp: new Date().toISOString(),
        _input: payload,
      };

      setLatestPrediction(enrichedPrediction);

      setHistory(prev => [
        enrichedPrediction,
        ...prev.slice(0, 49),
      ]);

      return prediction;

    } catch (err) {

      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Prediction failed';

      setError(msg);

      throw err;

    } finally {

      setLoading(false);

    }

  }, []);

  // ==========================================================
  // CSV PREDICTION
  // ==========================================================

  const runCSVPrediction = useCallback(async (file) => {

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {

      const data = await predictCSV(
        file,
        setUploadProgress
      );

      // ------------------------------------------------------
      // Validate response
      // ------------------------------------------------------

      if (!data || !Array.isArray(data.predictions)) {

        throw new Error(
          'Backend returned an invalid prediction response.'
        );

      }

      const predictions = data.predictions;

      // ------------------------------------------------------
      // Store complete CSV result
      // ------------------------------------------------------

      setCsvResult(data);

      // ------------------------------------------------------
      // IMPORTANT:
      // CSV prediction must also update latestPrediction.
      //
      // Dashboard components depend on latestPrediction.
      // Previously this remained null after CSV prediction.
      // ------------------------------------------------------

      if (predictions.length > 0) {

        const latest = {
          ...predictions[0],
          _timestamp: new Date().toISOString(),
          _input: predictions[0],
        };

        setLatestPrediction(latest);

        // Keep recent CSV predictions as dashboard history
        setHistory(
          predictions
            .slice(0, 50)
            .map(row => ({
              ...row,
              _timestamp: new Date().toISOString(),
              _input: row,
            }))
        );

      } else {

        setLatestPrediction(null);
        setHistory([]);

      }

      return data;

    } catch (err) {

      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'CSV prediction failed';

      setError(msg);

      throw err;

    } finally {

      setLoading(false);
      setUploadProgress(0);

    }

  }, []);

  // ==========================================================
  // CONTEXT
  // ==========================================================

  return (
    <AppContext.Provider
      value={{
        latestPrediction,
        history,
        csvResult,

        loading,
        error,
        uploadProgress,

        clearError,

        runSinglePrediction,
        runCSVPrediction,

        // Expose helpers to UI components
        toPercentage,
        healthPercentage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {

  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error(
      'useAppContext must be used within AppProvider'
    );
  }

  return ctx;
}