import { useQuery } from "@tanstack/react-query";
import type { Metrics } from "@/types/monitoring";
import { supabase } from "@/integrations/supabase/client";

export const useMetrics = () => {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: async (): Promise<Metrics> => {
      const { data: systemMetrics } = await supabase.rpc("get_system_metrics");
      const { data: alerts } = await supabase.from("system_alerts").select("*");
      const { data: performance } = await supabase
        .from("system_metrics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60); // Last 60 records for performance metrics

      return {
        system: systemMetrics as Metrics["system"],
        alerts: alerts || [],
        performance: performance || []
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};