import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';
import { createSupabaseMock } from '../utils/supabaseMocks';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Permanent Link Management System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('allocates links correctly', async () => {
    const productId = 'test-product-id';
    const mockSupabase = createSupabaseMock();
    
    const mockResponse = {
      data: { id: 1, url_key: 'p1', status: 'available' },
      error: null
    };

    mockSupabase.from().select.mockResolvedValueOnce(mockResponse);
    
    const result = await PermanentLinkManager.assignLink(productId);
    expect(result).toBe('p1');
  });

  test('handles product rotation correctly', async () => {
    const oldProductId = 'old-product';
    const newProductId = 'new-product';
    const mockSupabase = createSupabaseMock();

    // First, simulate an existing link
    mockSupabase.from().select.mockResolvedValueOnce({
      data: { id: 1, url_key: 'p1', current_listing_id: oldProductId },
      error: null
    });

    // Then test rotation
    const result = await PermanentLinkManager.assignLink(newProductId);
    expect(result).toBe('p1');
    expect(mockSupabase.from().update).toHaveBeenCalled();
  });

  test('handles expired listings correctly', async () => {
    const expiredListingId = 'expired-listing';
    const mockSupabase = createSupabaseMock();

    await PermanentLinkManager.releaseLink(expiredListingId);
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      current_listing_id: null,
      status: 'available'
    });
  });

  test('recycles links properly', async () => {
    const mockSupabase = createSupabaseMock();
    
    await PermanentLinkManager.recycleExpiredLinks();
    expect(mockSupabase.from().update).toHaveBeenCalled();
  });

  test('maintains URL structure consistency', async () => {
    const mockSupabase = createSupabaseMock();
    const urlKey = 'p1';
    
    mockSupabase.from().select.mockResolvedValueOnce({
      data: { current_listing_id: 'test-listing' },
      error: null
    });

    const result = await PermanentLinkManager.getProductByLink(urlKey);
    expect(result).toBeDefined();
  });

  test('handles 404 cases appropriately', async () => {
    const mockSupabase = createSupabaseMock();
    const nonExistentKey = 'non-existent';

    mockSupabase.from().select.mockResolvedValueOnce({
      data: null,
      error: null
    });

    const result = await PermanentLinkManager.getProductByLink(nonExistentKey);
    expect(result).toBeNull();
  });
});