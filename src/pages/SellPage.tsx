import { ProductListingForm } from "@/components/products/ProductListingForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { FormData } from "@/types/product-form";

const SellPage = () => {
  const { toast } = useToast();

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

      toast({ title: "Product listed successfully!" });
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