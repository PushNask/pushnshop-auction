import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  response_time: number;
  error_rate: number;
  active_users: number;
}

export function SystemMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSystemMetrics = async () => {
      const { data } = await supabase.rpc('get_system_metrics');
      setMetrics(data);
    };

    const fetchAlerts = async () => {
      const { data } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      setAlerts(data || []);
    };

    const fetchLogs = async () => {
      const { data } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      setLogs(data || []);
    };

    // Initial fetch
    fetchSystemMetrics();
    fetchAlerts();
    fetchLogs();

    // Set up real-time subscriptions
    const metricsSubscription = supabase
      .channel('system_metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_metrics' }, 
          payload => {
        setMetrics(payload.new as SystemMetrics);
      })
      .subscribe();

    const alertsSubscription = supabase
      .channel('system_alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_alerts' }, 
          payload => {
        setAlerts(prev => [payload.new, ...prev].slice(0, 10));
      })
      .subscribe();

    // Cleanup
    return () => {
      metricsSubscription.unsubscribe();
      alertsSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">System Health</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">CPU Usage</h3>
            <Progress value={metrics?.cpu || 0} className="mb-2" />
            <span className="text-sm text-gray-600">{metrics?.cpu || 0}%</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
            <Progress value={metrics?.memory || 0} className="mb-2" />
            <span className="text-sm text-gray-600">{metrics?.memory || 0}%</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Response Time</h3>
            <Progress value={metrics?.response_time ? Math.min(metrics.response_time / 10, 100) : 0} className="mb-2" />
            <span className="text-sm text-gray-600">{metrics?.response_time || 0}ms</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts.map(alert => (
              <Alert
                key={alert.id}
                variant={alert.severity === 'high' ? 'destructive' : 'default'}
              >
                <AlertDescription>
                  {alert.metric}: {alert.value} (Threshold: {alert.threshold})
                </AlertDescription>
              </Alert>
            ))}
            {alerts.length === 0 && (
              <p className="text-sm text-gray-500">No active alerts</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Level</th>
                  <th className="text-left p-2">Message</th>
                  <th className="text-left p-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-t">
                    <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="p-2">
                      <Badge variant={
                        log.level === 'error' ? 'destructive' : 
                        log.level === 'warning' ? 'warning' : 
                        'default'
                      }>
                        {log.level}
                      </Badge>
                    </td>
                    <td className="p-2">{log.message}</td>
                    <td className="p-2">{log.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}