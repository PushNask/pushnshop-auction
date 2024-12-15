import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductListingForm } from "@/components/products/ProductListingForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FormData } from "@/types/product-form";

const SellPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to create a listing",
        });
        navigate('/auth');
        return;
      }

      // Check if user is a seller or admin
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || !userData || (userData.role !== 'seller' && userData.role !== 'admin')) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Only sellers can create listings",
        });
        navigate('/');
        return;
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSubmit = async (formData: FormData): Promise<{ data: any; error: { message: string } | null }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          currency: formData.currency,
          quantity: parseInt(formData.quantity),
          seller_id: user.id,
          status: 'draft'
        });

      if (error) {
        throw new Error(error.message);
      }

      toast({ 
        title: "Success",
        description: "Product listed successfully!" 
      });
      
      return { data: null, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: error instanceof Error ? error.message : 'An error occurred' } 
      };
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">List Your Product</h1>
      <ProductListingForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SellPage;