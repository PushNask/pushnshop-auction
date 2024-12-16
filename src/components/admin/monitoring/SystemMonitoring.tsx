import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { SystemMetrics } from "@/types/monitoring";

export const SystemMonitoring = () => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_system_metrics");
      if (error) throw error;

      // Validate and transform the data to match SystemMetrics type
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Invalid metrics data received');
      }

      const metricsData: SystemMetrics = {
        cpu: Number(data.cpu) || 0,
        memory: Number(data.memory) || 0,
        disk: Number(data.disk) || 0,
        response_time: Number(data.response_time) || 0,
        error_rate: Number(data.error_rate) || 0,
        active_users: Number(data.active_users) || 0
      };

      return metricsData;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading system metrics: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!metrics) {
    return <div className="p-4">No metrics available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Memory Usage</h3>
        <p className="text-2xl">{metrics.memory.toFixed(2)}%</p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">CPU Usage</h3>
        <p className="text-2xl">{metrics.cpu.toFixed(2)}%</p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Database Connections</h3>
        <p className="text-2xl">{metrics.active_users}</p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Response Time</h3>
        <p className="text-2xl">{metrics.response_time.toFixed(2)}ms</p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Error Rate</h3>
        <p className="text-2xl">{metrics.error_rate.toFixed(2)}%</p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Active Users</h3>
        <p className="text-2xl">{metrics.active_users}</p>
      </Card>
    </div>
  );
};

export default SystemMonitoring;