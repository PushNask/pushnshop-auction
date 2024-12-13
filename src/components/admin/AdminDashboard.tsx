import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Navigate } from "react-router-dom";
import { StatsOverview } from "./dashboard/StatsOverview";
import { PaymentVerification } from "./dashboard/PaymentVerification";

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
      <StatsOverview />
      <PaymentVerification />
    </div>
  );
};

export default AdminDashboard;