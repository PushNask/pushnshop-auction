import { useQuery } from "@tanstack/react-query";
import type { Metrics, SystemMetrics, Alert, PerformanceMetric } from "@/types/monitoring";
import { supabase } from "@/integrations/supabase/client";

export const useMetrics = () => {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: async (): Promise<Metrics> => {
      const { data: systemMetricsData, error: systemError } = await supabase.rpc("get_system_metrics");
      if (systemError) throw systemError;

      const { data: alertsData, error: alertsError } = await supabase.from("system_alerts").select("*");
      if (alertsError) throw alertsError;

      const { data: performanceData, error: perfError } = await supabase
        .from("system_metrics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);
      if (perfError) throw perfError;

      // Validate and transform system metrics
      if (!systemMetricsData || typeof systemMetricsData !== 'object' || Array.isArray(systemMetricsData)) {
        throw new Error('Invalid system metrics data');
      }

      const systemMetrics: SystemMetrics = {
        cpu: Number(systemMetricsData.cpu) || 0,
        memory: Number(systemMetricsData.memory) || 0,
        disk: Number(systemMetricsData.disk) || 0,
        response_time: Number(systemMetricsData.response_time) || 0,
        error_rate: Number(systemMetricsData.error_rate) || 0,
        active_users: Number(systemMetricsData.active_users) || 0
      };

      // Transform alerts data to match Alert type
      const alerts: Alert[] = (alertsData || []).map(alert => ({
        id: alert.id,
        metric: alert.metric as keyof SystemMetrics,
        value: Number(alert.value),
        threshold: Number(alert.threshold),
        severity: alert.severity as Alert['severity'],
        acknowledged: Boolean(alert.acknowledged),
        created_at: alert.created_at
      }));

      // Transform performance data
      const performance: PerformanceMetric[] = (performanceData || []).map(metric => ({
        created_at: metric.created_at,
        response_time: Number(metric.response_time) || 0,
        error_rate: Number(metric.error_rate) || 0,
        active_users: Number(metric.active_users) || 0
      }));

      return {
        system: systemMetrics,
        alerts,
        performance
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};