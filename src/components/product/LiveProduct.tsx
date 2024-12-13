import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/currency';

interface LiveProductProps {
  productId: string;
}

export const LiveProduct = ({ productId }: LiveProductProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
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
        payload => {
          setProduct(payload.new as Product);
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
          {formatCurrency(product.price, product.currency)}
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