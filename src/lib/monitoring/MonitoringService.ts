import { supabase } from '@/integrations/supabase/client';
import type { SystemMetrics, AlertConfig, Alert } from './types';

export class MonitoringService {
  private static alertConfigs: AlertConfig[] = [
    { metric: 'responseTime', threshold: 1000, condition: 'above', severity: 'high' },
    { metric: 'errorRate', threshold: 5, condition: 'above', severity: 'high' },
    { metric: 'memoryUsage', threshold: 90, condition: 'above', severity: 'medium' },
    { metric: 'cpuUsage', threshold: 80, condition: 'above', severity: 'medium' },
    { metric: 'databaseConnections', threshold: 100, condition: 'above', severity: 'low' }
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
        responseTime: performance.now() - startTime,
        errorRate: errorStats.errorRate,
        activeUsers: userStats.activeUsers,
        memoryUsage: resourceStats.memoryUsage,
        cpuUsage: resourceStats.cpuUsage,
        databaseConnections: dbStats.connections
      };

      await this.saveMetrics(metrics);
      return metrics;
    } catch (error) {
      console.error('Failed to collect metrics:', error);
      throw error;
    }
  }

  private static async saveMetrics(metrics: SystemMetrics) {
    await supabase.from('system_metrics').insert([metrics]);
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
    return {
      memoryUsage: performance.memory?.usedJSHeapSize / 1024 / 1024 || 0,
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
    await supabase.from('system_alerts').insert(alerts);
  }

  static async logError(error: Error, metadata?: Record<string, any>) {
    const errorLog = {
      error_message: error.message,
      stack_trace: error.stack,
      metadata: metadata || {},
      user_id: (await supabase.auth.getUser()).data.user?.id
    };

    await supabase.from('error_logs').insert([errorLog]);
  }
}