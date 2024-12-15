import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminDashboardMetrics } from "@/types/admin-dashboard";

interface MetricsContextType {
  metrics: AdminDashboardMetrics | null;
  isLoading: boolean;
  error: Error | null;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const useAdminMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useAdminMetrics must be used within a MetricsProvider');
  }
  return context;
};

interface MetricsProviderProps {
  children: ReactNode;
}

export const AdminMetricsProvider = ({ children }: MetricsProviderProps) => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_dashboard_metrics", {
        time_range: "7d"
      });
      
      if (error) throw error;
      
      if (!data?.overview || !data?.userMetrics || !data?.productMetrics) {
        throw new Error("Invalid metrics data structure");
      }
      
      return data as AdminDashboardMetrics;
    }
  });

  return (
    <MetricsContext.Provider value={{ metrics, isLoading, error: error as Error | null }}>
      {children}
    </MetricsContext.Provider>
  );
};