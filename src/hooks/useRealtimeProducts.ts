import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';
import { mapDbProductToProduct } from '@/utils/product';

export const useRealtimeProducts = (initialProducts: Product[] = []) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const channel = supabase
      .channel('products_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          if (payload.new) {
            // Fetch complete product data including images
            const { data: productData } = await supabase
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
              .eq('id', payload.new.id)
              .single();

            if (productData) {
              const mappedProduct = mapDbProductToProduct(productData);
              setProducts(prev => [...prev, mappedProduct]);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          if (payload.new) {
            // Fetch complete product data including images
            const { data: productData } = await supabase
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
              .eq('id', payload.new.id)
              .single();

            if (productData) {
              const mappedProduct = mapDbProductToProduct(productData);
              setProducts(prev => 
                prev.map(p => p.id === mappedProduct.id ? mappedProduct : p)
              );
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          if (payload.old) {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return products;
};