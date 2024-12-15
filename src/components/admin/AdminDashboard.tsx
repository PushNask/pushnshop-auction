import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatsOverview } from "./dashboard/StatsOverview";
import { PaymentVerification } from "./dashboard/PaymentVerification";
import { UserManagement } from "./users/UserManagement";
import { PendingListings } from "./listings/PendingListings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminDashboardMetrics } from "@/types/admin-dashboard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please log in to access the admin dashboard",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        // Check if user is admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;

        if (userData?.role !== 'admin') {
          toast({
            title: "Access denied",
            description: "You don't have permission to access the admin dashboard",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error: any) {
        console.error('Auth check failed:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to verify authentication",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc("get_admin_dashboard_metrics", {
          time_range: "7d"
        });
        
        if (error) {
          console.error("Error fetching metrics:", error);
          throw error;
        }
        
        return data as AdminDashboardMetrics;
      } catch (error) {
        console.error("Error in metrics query:", error);
        throw error;
      }
    }
  });

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

export default AdminDashboard;