import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisSession {
  session_id: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  zip_url?: string;
  created_at: string;
  expires_at: string;
}

interface UseAnalysisPollingReturn {
  session: AnalysisSession | null;
  isPolling: boolean;
  error: string | null;
  startPolling: (sessionId: string) => void;
  stopPolling: () => void;
}

export const useAnalysisPolling = (pollInterval: number = 5000): UseAnalysisPollingReturn => {
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const fetchSession = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('analysis_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        throw error;
      }

      setSession(data as AnalysisSession);
      setError(null);

      // Stop polling if completed or failed
      if (data.status === 'completed' || data.status === 'failed') {
        stopPolling();
      }

      return data;
    } catch (err) {
      console.error('Failed to fetch session:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch session');
      return null;
    }
  }, []);

  const startPolling = useCallback((sessionId: string) => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    setIsPolling(true);
    setError(null);

    // Initial fetch
    fetchSession(sessionId);

    // Set up polling
    const id = setInterval(() => {
      fetchSession(sessionId);
    }, pollInterval);

    setIntervalId(id);
  }, [fetchSession, pollInterval, intervalId]);

  const stopPolling = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPolling(false);
  }, [intervalId]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    session,
    isPolling,
    error,
    startPolling,
    stopPolling
  };
};