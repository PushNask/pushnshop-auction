import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle } from "lucide-react";
import { StatsOverview } from "./StatsOverview";
import { PaymentVerification } from "./PaymentVerification";
import { UserManagement } from "../users/UserManagement";
import { PendingListings } from "../listings/PendingListings";
import { LinkManagement } from "../links/LinkManagement";
import { AdminAuthCheck } from "./AdminAuthCheck";
import { AdminMetricsProvider, useAdminMetrics } from "./AdminMetricsProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DashboardContent = () => {
  const { metrics, isLoading, error } = useAdminMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load dashboard metrics'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      
      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <TabsTrigger value="overview" className="w-full">Overview</TabsTrigger>
          <TabsTrigger value="listings" className="w-full">Listings</TabsTrigger>
          <TabsTrigger value="links" className="w-full">Links</TabsTrigger>
          <TabsTrigger value="payments" className="w-full">Payments</TabsTrigger>
          <TabsTrigger value="users" className="w-full">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StatsOverview metrics={metrics} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="listings">
          <PendingListings />
        </TabsContent>

        <TabsContent value="links">
          <LinkManagement />
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