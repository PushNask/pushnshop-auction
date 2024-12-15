import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { mapDbProductToProduct } from '@/utils/product';
import type { Product, DbProduct } from '@/types/product';

interface LiveProductProps {
  productId: string;
}

export const LiveProduct = ({ productId }: LiveProductProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            url,
            alt,
            order_number,
            product_id,
            created_at
          ),
          users!products_seller_id_fkey (
            whatsapp_number
          )
        `)
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      
      if (productData) {
        const mappedProduct = mapDbProductToProduct(productData as DbProduct);
        setProduct(mappedProduct);
      }
      
      setIsLoading(false);
    };

    fetchProduct();

    const subscription = supabase
      .channel(`product-${productId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${productId}`
        },
        async (payload) => {
          if (payload.new) {
            const { data: productData } = await supabase
              .from('products')
              .select(`
                *,
                product_images (
                  id,
                  url,
                  alt,
                  order_number,
                  product_id,
                  created_at
                ),
                users!products_seller_id_fkey (
                  whatsapp_number
                )
              `)
              .eq('id', productId)
              .single();

            if (productData) {
              const mappedProduct = mapDbProductToProduct(productData as DbProduct);
              setProduct(mappedProduct);
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [productId]);

  if (isLoading) {
    return <Loader2 className="w-6 h-6 animate-spin" />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {product.currency === 'XAF' 
            ? `XAF ${product.price.toLocaleString()}`
            : `$${product.price.toFixed(2)}`}
        </p>
        <div className="mt-2">
          {product.quantity > 0 ? (
            <span className="text-green-500">
              {product.quantity} available
            </span>
          ) : (
            <span className="text-red-500">Sold out</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};