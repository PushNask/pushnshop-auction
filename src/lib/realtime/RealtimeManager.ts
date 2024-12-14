import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ProductSubscriptionCallbacks {
  onInsert: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export class RealtimeManager {
  static subscribeToProducts(callbacks: ProductSubscriptionCallbacks): RealtimeChannel {
    return supabase
      .channel('products_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          if (payload.new) {
            callbacks.onInsert(payload.new as Product);
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
        (payload) => {
          if (payload.new) {
            callbacks.onUpdate(payload.new as Product);
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
            callbacks.onDelete(payload.old as Product);
          }
        }
      )
      .subscribe();
  }
}