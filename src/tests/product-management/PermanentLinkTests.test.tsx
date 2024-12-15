import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: 1, url_key: 'p1', status: 'available' },
        error: null
      }),
    })),
  },
}));

describe('Permanent Link System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('allocates links correctly', async () => {
    const productId = 'test-product-id';
    
    const result = await PermanentLinkManager.assignLink(productId);
    expect(result).toBe('p1');
    expect(supabase.from).toHaveBeenCalledWith('permanent_links');
  });

  test('handles expired listings correctly', async () => {
    const expiredListingId = 'expired-listing';
    
    await PermanentLinkManager.releaseLink(expiredListingId);
    expect(supabase.from).toHaveBeenCalledWith('permanent_links');
  });

  test('maintains URL structure consistency', async () => {
    const mockLink = await PermanentLinkManager.getProductByLink('p1');
    expect(mockLink).toBeDefined();
  });

  test('handles 404 for invalid links', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }));

    const result = await PermanentLinkManager.getProductByLink('invalid-key');
    expect(result).toBeNull();
  });
});