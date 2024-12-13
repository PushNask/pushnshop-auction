import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToProduct(productId: string, callbacks: {
    onQuantityChange?: (newQuantity: number) => void;
    onStatusChange?: (newStatus: string) => void;
    onError?: (error: Error) => void;
  }) {
    const channel = supabase
      .channel(`product-${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${productId}`
        },
        (payload) => {
          const { new: newData } = payload;
          callbacks.onQuantityChange?.(newData.quantity);
          callbacks.onStatusChange?.(newData.status);
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          callbacks.onError?.(new Error('Failed to subscribe to product updates'));
        }
      });

    this.channels.set(productId, channel);
    return () => this.unsubscribe(productId);
  }

  private unsubscribe(channelId: string) {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(channelId);
    }
  }

  cleanup() {
    this.channels.forEach(channel => channel.unsubscribe());
    this.channels.clear();
  }
}

export const realtimeManager = new RealtimeManager();