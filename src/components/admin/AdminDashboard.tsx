import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Navigate } from "react-router-dom";
import { StatsOverview } from "./dashboard/StatsOverview";
import { PaymentVerification } from "./dashboard/PaymentVerification";
import { SystemMonitoring } from "./monitoring/SystemMonitoring";
import { UserManagement } from "./users/UserManagement";
import { PendingListings } from "./listings/PendingListings";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminDashboardMetrics } from "@/types/admin-dashboard";

const AdminDashboard = () => {
  const { isAuthorized, isChecking } = useAuthCheck();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_dashboard_metrics", {
        time_range: "7d"
      });
      if (error) throw error;
      return data as unknown as AdminDashboardMetrics;
    }
  });

  if (isChecking) {
    return <div>Checking authorization...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {metrics && <StatsOverview metrics={metrics.overview} isLoading={isLoading} />}
        </TabsContent>

        <TabsContent value="listings">
          <PendingListings />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentVerification />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="system">
          <SystemMonitoring />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;