import { useState, useEffect } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { RealtimeManager } from '@/lib/realtime/RealtimeManager';
import type { Product } from '@/types/product';
import type { Database } from '@/integrations/supabase/types';

type ProductPayload = RealtimePostgresChangesPayload<Database['public']['Tables']['products']['Row']>;

export function useRealtimeProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    // Update state when initialProducts changes
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    // Subscribe to product changes
    RealtimeManager.subscribe('products', 'INSERT', (payload: ProductPayload) => {
      setProducts(prev => [...prev, payload.new as unknown as Product]);
    });

    RealtimeManager.subscribe('products', 'UPDATE', (payload: ProductPayload) => {
      setProducts(prev =>
        prev.map(product =>
          product.id === payload.new.id 
            ? { ...product, ...payload.new as unknown as Product }
            : product
        )
      );
    });

    RealtimeManager.subscribe('products', 'DELETE', (payload: ProductPayload) => {
      setProducts(prev =>
        prev.filter(product => product.id !== payload.old.id)
      );
    });

    // Cleanup subscriptions
    return () => {
      RealtimeManager.unsubscribe('products', 'INSERT');
      RealtimeManager.unsubscribe('products', 'UPDATE');
      RealtimeManager.unsubscribe('products', 'DELETE');
    };
  }, []); // Empty dependency array since we don't want to re-subscribe

  return products;
}