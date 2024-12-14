import { useEffect, useState } from 'react';
import { RealtimeManager } from '@/lib/realtime/RealtimeManager';
import type { Product } from '@/types/product';

export const useRealtimeProducts = (initialProducts: Product[] = []) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const subscription = RealtimeManager.subscribeToProducts({
      onInsert: (newProduct: Product) => {
        setProducts(prev => [...prev, newProduct]);
      },
      onUpdate: (updatedProduct: Product) => {
        setProducts(prev => 
          prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
      },
      onDelete: (deletedProduct: Product) => {
        setProducts(prev => prev.filter(p => p.id !== deletedProduct.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return products;
};