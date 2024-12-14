import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import type { SystemMetrics, SystemAlert } from '@/types/analytics';

interface SystemHealthMonitorProps {
  refreshInterval?: number;
}

export const SystemHealthMonitor = ({
  refreshInterval = 30000
}: SystemHealthMonitorProps) => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase.rpc('get_system_metrics');
        
        if (error) throw error;
        
        if (data) {
          setMetrics(data as SystemMetrics);
        }

        const { data: alertsData } = await supabase
          .from('system_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (alertsData) {
          const transformedAlerts: SystemAlert[] = alertsData.map(alert => ({
            id: String(alert.id),
            type: alert.severity === 'high' ? 'error' : 'warning',
            message: `${alert.metric}: ${alert.value} exceeded threshold ${alert.threshold}`,
            timestamp: alert.created_at,
            metric: alert.metric,
            value: alert.value,
            threshold: alert.threshold,
            severity: alert.severity as 'high' | 'medium' | 'low'
          }));
          setAlerts(transformedAlerts);
        }
      } catch (error) {
        console.error('Error fetching system metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (!metrics) {
    return <div>Loading system metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.cpu} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">{metrics.cpu.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.memory} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">{metrics.memory.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.active_users}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">System Alerts</h3>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.type === 'error' ? 'destructive' : 'default'}
          >
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default SystemHealthMonitor;