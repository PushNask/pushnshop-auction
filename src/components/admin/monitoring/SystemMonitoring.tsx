import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SystemMetrics } from "@/types/analytics";
import { Card } from "@/components/ui/card";

const SystemMonitoring = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_system_metrics");
      if (error) throw error;
      return data as SystemMetrics;
    }
  });

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">System Monitoring</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold">Response Time</h3>
          <p>{metrics?.response_time} ms</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Error Rate</h3>
          <p>{metrics?.error_rate}%</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Active Users</h3>
          <p>{metrics?.active_users}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Memory Usage</h3>
          <p>{metrics?.memory}%</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">CPU Usage</h3>
          <p>{metrics?.cpu}%</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Database Connections</h3>
          <p>{metrics?.database_connections}</p>
        </Card>
      </div>
    </div>
  );
};

export default SystemMonitoring;