import { useState, useEffect } from 'react';
import { MonitoringService } from '@/lib/monitoring/MonitoringService';
import { MetricsChart } from './MetricsChart';
import { AlertsList } from './AlertsList';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import type { SystemMetrics, Alert } from '@/lib/monitoring/types';

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<(SystemMetrics & { timestamp: number })[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const currentMetrics = await MonitoringService.collectMetrics();
        setMetrics(prev => [...prev, { ...currentMetrics, timestamp: Date.now() }].slice(-60));
        
        const newAlerts = await MonitoringService.checkAlerts(currentMetrics);
        if (newAlerts.length > 0) {
          setAlerts(prev => [...newAlerts, ...prev].slice(0, 100));
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricsChart
          title="Response Time"
          data={metrics}
          dataKey="responseTime"
          stroke="#8884d8"
        />
        <MetricsChart
          title="Error Rate"
          data={metrics}
          dataKey="errorRate"
          stroke="#82ca9d"
        />
        <MetricsChart
          title="Active Users"
          data={metrics}
          dataKey="activeUsers"
          stroke="#ffc658"
        />
      </div>

      <AlertsList alerts={alerts} />
    </div>
  );
}