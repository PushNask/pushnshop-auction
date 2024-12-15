import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductListingForm } from "@/components/products/ProductListingForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FormData } from "@/types/product-form";

interface SubmitResponse {
  data: any | null;
  error: { message: string } | null;
}

const SellPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please log in to create a listing",
          });
          navigate('/auth');
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (userError || !userData || (userData.role !== 'seller' && userData.role !== 'admin')) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Only sellers can create listings",
          });
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify authentication",
        });
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSubmit = async (formData: FormData): Promise<SubmitResponse> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const { error: insertError } = await supabase
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

      if (insertError) throw insertError;

      toast({ 
        title: "Success",
        description: "Product listed successfully!" 
      });
      
      return { data: null, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      return { 
        data: null, 
        error: { message: errorMessage }
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