import { describe, it, expect } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Real-time Updates Tests', () => {
  it('should receive real-time quantity updates', async () => {
    // Create test user first
    const { data: { user }, error: userError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    if (userError) throw userError;

    // Create test product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        title: 'Test Product',
        description: 'Test Description',
        price: 1000,
        currency: 'XAF',
        quantity: 5,
        seller_id: user.id
      })
      .select()
      .single();
    if (productError) throw productError;

    return new Promise<void>((resolve) => {
      const channel = supabase
        .channel('product-updates')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${product.id}`,
        }, (payload) => {
          expect(payload.new.quantity).toBe(4);
          channel.unsubscribe();
          resolve();
        })
        .subscribe();

      // Update quantity
      supabase
        .from('products')
        .update({ quantity: 4 })
        .eq('id', product.id);
    });
  });
});