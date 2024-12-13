import { createContext, useContext, useState, useEffect } from 'react';
import type { Metrics } from '@/types/monitoring';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface MetricsContextType {
  metrics: Metrics | null;
  isLoading: boolean;
  error: Error | null;
}

const MetricsContext = createContext<MetricsContextType | null>(null);

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};

const setupWebSocket = (onMessage: (data: any) => void) => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${wsProtocol}//${window.location.host}/api/metrics`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return () => {
    ws.close();
  };
};

interface MetricsProviderProps {
  children: React.ReactNode;
}

export const MetricsProvider = ({ children }: MetricsProviderProps) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInitialMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMetrics();

    const cleanup = setupWebSocket((data) => {
      setMetrics(prev => ({
        ...prev,
        ...data
      }));
    });

    return cleanup;
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message}
          <button 
            onClick={() => window.location.reload()}
            className="underline ml-2"
          >
            Retry
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <MetricsContext.Provider value={{ metrics, isLoading, error }}>
      {children}
    </MetricsContext.Provider>
  );
};