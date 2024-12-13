import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Navigate } from "react-router-dom";
import { StatsOverview } from "./dashboard/StatsOverview";
import { PaymentVerification } from "./dashboard/PaymentVerification";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const { isAuthorized, isChecking } = useAuthCheck();

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
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <StatsOverview />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentVerification />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;