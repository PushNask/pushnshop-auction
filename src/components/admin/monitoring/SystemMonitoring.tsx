import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SystemMetrics } from "@/types/admin-dashboard";

export function SystemMonitoring() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_system_metrics");
      if (error) throw error;
      return data as unknown as SystemMetrics;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>System Monitoring</h2>
      <div>
        <p>CPU Usage: {metrics?.cpu}%</p>
        <p>Memory Usage: {metrics?.memory}%</p>
        <p>Disk Usage: {metrics?.disk}%</p>
        <p>Response Time: {metrics?.response_time}ms</p>
        <p>Error Rate: {metrics?.error_rate}%</p>
        <p>Active Users: {metrics?.active_users}</p>
      </div>
    </div>
  );
}
