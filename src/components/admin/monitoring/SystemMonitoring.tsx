import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SystemMetrics } from "@/lib/monitoring/types";

const SystemMonitoring = () => {
  const { data: metrics } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_system_metrics");
      if (error) throw error;
      return data as unknown as SystemMetrics;
    }
  });

  return (
    <div>
      <h2 className="text-lg font-semibold">System Monitoring</h2>
      {metrics ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Response Time</h3>
            <p>{metrics.response_time} ms</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Error Rate</h3>
            <p>{metrics.error_rate}%</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Active Users</h3>
            <p>{metrics.active_users}</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Memory Usage</h3>
            <p>{metrics.memory_usage} MB</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">CPU Usage</h3>
            <p>{metrics.cpu_usage}%</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Database Connections</h3>
            <p>{metrics.database_connections}</p>
          </div>
        </div>
      ) : (
        <p>Loading metrics...</p>
      )}
    </div>
  );
};

export default SystemMonitoring;