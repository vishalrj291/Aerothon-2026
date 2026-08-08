import { useState, useEffect } from 'react';
import { fetchModelInfo } from '../api/client';

/**
 * Fetches /model-info once on mount.
 * Returns { modelInfo, loading, error, refetch }
 */
export function useModelInfo() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchModelInfo();
      setModelInfo(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load model info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { modelInfo, loading, error, refetch: load };
}
