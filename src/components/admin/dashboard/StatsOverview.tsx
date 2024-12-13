import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductStats {
  status: string;
  payment_status: string;
  price: number;
  seller_id: string;
}

export const StatsOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('status, payment_status, price, seller_id')
        .eq('status', 'active');
      
      if (error) throw error;
      
      const typedData = data as ProductStats[];
      
      return {
        totalProducts: typedData.length,
        totalRevenue: typedData.reduce((acc, curr) => 
          curr.payment_status === 'completed' ? acc + curr.price : acc, 0),
        activeSellers: new Set(typedData.map(p => p.seller_id)).size
      };
    }
  });

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activeSellers || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">XAF {stats?.totalRevenue.toLocaleString() || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};