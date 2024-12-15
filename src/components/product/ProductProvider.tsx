import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { mapDbProductToProduct } from '@/utils/product';
import type { Product } from '@/types/product';

interface ProductProviderProps {
  children: (data: { products: Product[] }) => React.ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            product_images (
              id,
              url,
              alt,
              order_number
            ),
            users!products_seller_id_fkey (
              whatsapp_number
            )
          `)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        const mappedProducts = productsData.map(productData => {
          const mappedProduct = mapDbProductToProduct(productData);
          mappedProduct.images = (productData.product_images || []).map(img => ({
            id: img.id,
            url: img.url,
            alt: img.alt || '',
            order_number: img.order_number
          }));
          mappedProduct.sellerWhatsApp = productData.users?.whatsapp_number || '';
          return mappedProduct;
        });

        setProducts(mappedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return <>{children({ products })}</>;
};
