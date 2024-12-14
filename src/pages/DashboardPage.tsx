import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: userProducts, isLoading } = useQuery({
    queryKey: ['user-products'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', session.user.id);

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please login to access the dashboard",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold">Active Listings</h3>
          <p className="text-2xl">{userProducts?.filter(p => p.status === 'active').length || 0}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold">Pending Listings</h3>
          <p className="text-2xl">{userProducts?.filter(p => p.status === 'pending').length || 0}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold">Total Products</h3>
          <p className="text-2xl">{userProducts?.length || 0}</p>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProducts?.map((product) => (
            <Card key={product.id} className="p-4">
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-500">{product.status}</p>
              <p className="mt-2">{product.price} {product.currency}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;