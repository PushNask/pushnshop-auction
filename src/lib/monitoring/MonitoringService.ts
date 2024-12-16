import { supabase } from '@/integrations/supabase/client';
import type { SystemMetrics, AlertConfig, Alert } from '@/types/analytics';

export class MonitoringService {
  private static alertConfigs: AlertConfig[] = [
    { metric: 'response_time', threshold: 1000, condition: 'above', severity: 'high' },
    { metric: 'error_rate', threshold: 5, condition: 'above', severity: 'high' },
    { metric: 'memory_usage', threshold: 90, condition: 'above', severity: 'medium' },
    { metric: 'cpu_usage', threshold: 80, condition: 'above', severity: 'medium' },
    { metric: 'database_connections', threshold: 100, condition: 'above', severity: 'low' }
  ];

  static async collectMetrics(): Promise<SystemMetrics> {
    const startTime = performance.now();

    try {
      const [errorStats, userStats, resourceStats, dbStats] = await Promise.all([
        this.getErrorStats(),
        this.getUserStats(),
        this.getResourceStats(),
        this.getDatabaseStats()
      ]);

      const metrics: SystemMetrics = {
        response_time: performance.now() - startTime,
        error_rate: errorStats.errorRate,
        active_users: userStats.activeUsers,
        memory_usage: resourceStats.memoryUsage,
        cpu_usage: resourceStats.cpuUsage,
        database_connections: dbStats.connections
      };

      await this.saveMetrics(metrics);
      return metrics;
    } catch (error) {
      console.error('Failed to collect metrics:', error);
      throw error;
    }
  }

  static async logError(error: Error, context?: Record<string, any>) {
    try {
      const { error: dbError } = await supabase
        .from('error_logs')
        .insert([{
          error_message: error.message,
          stack_trace: error.stack,
          metadata: context
        }]);

      if (dbError) throw dbError;
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  }

  private static async saveMetrics(metrics: SystemMetrics) {
    const { error } = await supabase
      .from('system_metrics')
      .insert([metrics]);
      
    if (error) throw error;
  }

  private static async getErrorStats() {
    const { count } = await supabase
      .from('error_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

    return {
      errorRate: (count || 0) / 5 // errors per minute
    };
  }

  private static async getUserStats() {
    const { count } = await supabase
      .from('active_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_activity', new Date(Date.now() - 15 * 60 * 1000).toISOString());

    return {
      activeUsers: count || 0
    };
  }

  private static async getResourceStats() {
    // Check if performance.memory is available (Chrome only)
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100 : 0;

    return {
      memoryUsage,
      cpuUsage: 0 // Would be populated from hosting platform metrics
    };
  }

  private static async getDatabaseStats() {
    const { count } = await supabase
      .from('active_sessions')
      .select('*', { count: 'exact', head: true });

    return {
      connections: count || 0
    };
  }

  static async checkAlerts(metrics: SystemMetrics): Promise<Alert[]> {
    const alerts = this.alertConfigs
      .map(config => {
        const value = metrics[config.metric];
        const triggered = config.condition === 'above' 
          ? value > config.threshold
          : value < config.threshold;

        if (triggered) {
          return {
            metric: config.metric,
            value,
            threshold: config.threshold,
            severity: config.severity,
            timestamp: new Date()
          };
        }
        return null;
      })
      .filter((alert): alert is Alert => alert !== null);

    if (alerts.length > 0) {
      await this.saveAlerts(alerts);
    }

    return alerts;
  }

  private static async saveAlerts(alerts: Alert[]) {
    const { error } = await supabase
      .from('system_alerts')
      .insert(
        alerts.map(alert => ({
          metric: alert.metric,
          value: alert.value,
          threshold: alert.threshold,
          severity: alert.severity,
          created_at: alert.timestamp.toISOString()
        }))
      );
      
    if (error) throw error;
  }
}