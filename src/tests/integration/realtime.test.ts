import { describe, it, expect } from 'vitest';
import { createTestClient, generateTestData, cleanupTestData } from '../utils/testSetup';

describe('Real-time Updates Tests', () => {
  const supabase = createTestClient();
  
  it('should receive real-time quantity updates', (done) => {
    let testProduct: any;

    // Create test product first
    supabase
      .from('products')
      .insert(generateTestData().product)
      .select()
      .single()
      .then(({ data: product }) => {
        testProduct = product;

        const channel = supabase
          .channel('product-updates')
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'products',
            filter: `id=eq.${testProduct.id}`,
          }, (payload) => {
            expect(payload.new.quantity).toBe(4);
            channel.unsubscribe();
            cleanupTestData(supabase, { productId: testProduct.id });
            done();
          })
          .subscribe();

        // Update quantity
        supabase
          .from('products')
          .update({ quantity: 4 })
          .eq('id', testProduct.id);
      });
  });
});