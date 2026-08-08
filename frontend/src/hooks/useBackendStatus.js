import { useState, useEffect, useRef } from 'react';
import { fetchHealth } from '../api/client';

/**
 * Polls /health every 10 seconds.
 * Returns { isOnline, health, lastChecked }
 */
export function useBackendStatus() {
  const [isOnline, setIsOnline] = useState(null);
  const [health, setHealth]     = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const isMounted = useRef(true);

  const check = async () => {
    try {
      const data = await fetchHealth();
      if (!isMounted.current) return;
      setHealth(data);
      setIsOnline(data?.status === 'healthy');
      setLastChecked(new Date());
    } catch {
      if (!isMounted.current) return;
      setIsOnline(false);
      setHealth(null);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    isMounted.current = true;
    check();
    const id = setInterval(check, 10000);
    return () => {
      isMounted.current = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isOnline, health, lastChecked };
}
