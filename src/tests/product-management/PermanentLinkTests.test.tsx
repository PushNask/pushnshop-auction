import { vi } from 'vitest';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }),
  },
}));

describe('Permanent Link System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('allocates links correctly', async () => {
    const manager = new PermanentLinkManager();
    const productId = 'test-product-id';
    
    const mockLink = {
      id: 1,
      url_key: 'p1',
      status: 'available',
    };
    
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockLink, error: null }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }));

    const result = await manager.assignLink(productId);
    expect(result).toBe('p1');
  });

  test('handles expired listings correctly', async () => {
    const manager = new PermanentLinkManager();
    
    const mockExpiredLink = {
      id: 1,
      url_key: 'p1',
      current_listing_id: 'expired-listing',
    };
    
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }));

    await manager.releaseLink('expired-listing');
    expect(supabase.from).toHaveBeenCalledWith('permanent_links');
  });
});