import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Analytics Tests', () => {
  let testUser;
  let testProduct;

  beforeEach(async () => {
    // Create test user
    const { data: { user }, error: userError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    if (userError) throw userError;
    testUser = user;

    // Create test product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        title: 'Test Product',
        description: 'Test Description',
        price: 1000,
        currency: 'XAF',
        quantity: 5,
        seller_id: testUser.id
      })
      .single();
    if (productError) throw productError;
    testProduct = product;
  });

  afterEach(async () => {
    if (testProduct?.id) {
      await supabase.from('products').delete().eq('id', testProduct.id);
    }
    if (testUser?.id) {
      await supabase.auth.admin.deleteUser(testUser.id);
    }
  });

  it('should track product views and interactions', async () => {
    const { data: analytics, error } = await supabase
      .from('analytics')
      .insert({
        listing_id: testProduct.id,
        views: 1,
        whatsapp_clicks: 1,
      })
      .single();

    expect(error).toBeNull();
    expect(analytics.views).toBe(1);
    expect(analytics.whatsapp_clicks).toBe(1);
  });
});