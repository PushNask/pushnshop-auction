import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestClient, generateTestData, cleanupTestData } from '../utils/testSetup';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

describe('Product Management Tests', () => {
  let supabase: SupabaseClient<Database>;
  let testUser: { id: string };
  let testProduct: Database['public']['Tables']['products']['Row'];

  beforeEach(async () => {
    supabase = createTestClient();
    const testData = generateTestData();
    
    // Create test user
    const { data: { user }, error: userError } = await supabase.auth.signUp(testData.user);
    if (userError) throw userError;
    testUser = user!;

    // Create test product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        ...testData.product,
        seller_id: testUser.id,
      })
      .select()
      .single();
    if (productError) throw productError;
    testProduct = product;
  });

  afterEach(async () => {
    await cleanupTestData(supabase, {
      productId: testProduct?.id,
      userId: testUser?.id
    });
  });

  it('should create a product with images', async () => {
    const testImageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`${testProduct.id}/test.jpg`, testImageFile);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should handle listing creation and permanent link assignment', async () => {
    const { listing } = generateTestData();
    
    const { data, error } = await supabase
      .from('listings')
      .insert({
        product_id: testProduct.id,
        ...listing,
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data?.permanent_link_id).toBeDefined();
  });
});