import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { StatsOverview } from "./StatsOverview";
import { PaymentVerification } from "./PaymentVerification";
import { UserManagement } from "../users/UserManagement";
import { PendingListings } from "../listings/PendingListings";
import { AdminAuthCheck } from "./AdminAuthCheck";
import { AdminMetricsProvider, useAdminMetrics } from "./AdminMetricsProvider";

const DashboardContent = () => {
  const { metrics, isLoading } = useAdminMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
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
        </TabsList>

        <TabsContent value="overview">
          <StatsOverview metrics={metrics} isLoading={isLoading} />
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
      </Tabs>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <AdminAuthCheck>
      <AdminMetricsProvider>
        <DashboardContent />
      </AdminMetricsProvider>
    </AdminAuthCheck>
  );
};

export default AdminDashboard;