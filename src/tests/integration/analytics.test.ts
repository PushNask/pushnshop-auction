import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestClient, generateTestData, cleanupTestData } from '../utils/testSetup';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

describe('Analytics Tests', () => {
  let supabase: SupabaseClient<Database>;
  let testListing: Database['public']['Tables']['listings']['Row'];

  beforeEach(async () => {
    supabase = createTestClient();
    const { product } = generateTestData();
    
    // Create test product and listing
    const { data: createdProduct } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    const { data: listing } = await supabase
      .from('listings')
      .insert({
        product_id: createdProduct!.id,
        duration_hours: 24,
        price_paid: 5000,
      })
      .select()
      .single();

    testListing = listing!;
  });

  afterEach(async () => {
    if (testListing) {
      await cleanupTestData(supabase, { listingId: testListing.id });
    }
  });

  it('should track product views and interactions', async () => {
    const { data: analytics, error } = await supabase
      .from('analytics')
      .insert({
        listing_id: testListing.id,
        views: 1,
        whatsapp_clicks: 1,
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(analytics?.views).toBe(1);
    expect(analytics?.whatsapp_clicks).toBe(1);
  });
});