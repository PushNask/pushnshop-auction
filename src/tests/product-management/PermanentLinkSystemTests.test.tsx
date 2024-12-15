import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { supabase } from '@/integrations/supabase/client';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 1,
          url_key: 'p1',
          url_path: '/p/1',
          status: 'available',
          current_listing_id: null
        },
        error: null
      })
    })),
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null })
    }
  }
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

  test('handles expired listings', async () => {
    const expiredListingId = 'expired-listing';
    await PermanentLinkManager.releaseLink(expiredListingId);
    
    expect(supabase.from).toHaveBeenCalledWith('permanent_links');
    expect(supabase.from().update).toHaveBeenCalledWith({
      current_listing_id: null,
      status: 'available'
    });
  });

  test('maintains URL structure consistency', async () => {
    const mockLink = await PermanentLinkManager.getProductByLink('p1');
    expect(mockLink).toBeDefined();
    expect(supabase.from().select).toHaveBeenCalled();
  });

  test('handles 404 for invalid links', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null })
    }));

    const result = await PermanentLinkManager.getProductByLink('invalid-key');
    expect(result).toBeNull();
  });

  test('rotates products correctly', async () => {
    const newProductId = 'new-product';
    await PermanentLinkManager.assignLink(newProductId);
    
    expect(supabase.from().update).toHaveBeenCalledWith(expect.objectContaining({
      current_listing_id: newProductId,
      status: 'active'
    }));
  });
});