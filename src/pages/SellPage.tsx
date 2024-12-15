import { ProductListingForm } from "@/components/products/ProductListingForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SellPage = () => {
  const { toast } = useToast();

  const handleSubmit = async (data: FormData): Promise<{ data: any; error: { message: string } }> => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([
          {
            title: data.get('title'),
            description: data.get('description'),
            price: parseFloat(data.get('price') as string),
            // Add other fields as necessary
          }
        ]);

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
