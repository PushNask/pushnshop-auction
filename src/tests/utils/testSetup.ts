import '@testing-library/jest-dom';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export const createTestClient = () => {
  return createClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );
};

export const generateTestData = () => ({
  product: {
    title: 'Test Product',
    description: 'Test Description',
    price: 1000,
    currency: 'XAF' as const,
    quantity: 5,
  },
  listing: {
    duration_hours: 24,
    price_paid: 5000,
  },
  user: {
    email: 'test@example.com',
    password: 'testpassword123',
    full_name: 'Test User',
    phone: '+237000000000',
  }
});

export const cleanupTestData = async (supabase: SupabaseClient<Database>, testData: {
  productId?: string;
  userId?: string;
  listingId?: string;
}) => {
  const { productId, userId, listingId } = testData;

  if (productId) {
    await supabase.from('products').delete().eq('id', productId);
  }
  if (listingId) {
    await supabase.from('listings').delete().eq('id', listingId);
  }
  if (userId) {
    await supabase.auth.admin.deleteUser(userId);
  }
};