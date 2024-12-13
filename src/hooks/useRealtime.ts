import { useState, useEffect } from 'react';
import { realtimeManager } from '@/lib/realtime';

export function useProductRealtime(productId: string) {
  const [quantity, setQuantity] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = realtimeManager.subscribeToProduct(productId, {
      onQuantityChange: (newQuantity) => setQuantity(newQuantity),
      onStatusChange: (newStatus) => setStatus(newStatus),
      onError: (error) => setError(error)
    });

    return () => {
      unsubscribe();
    };
  }, [productId]);

  return { quantity, status, error };
}