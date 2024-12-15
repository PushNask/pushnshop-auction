import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';
import { createSupabaseMock } from '../utils/supabaseMocks';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Permanent Link System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('allocates links correctly', async () => {
    const productId = 'test-product-id';
    const mockSupabase = createSupabaseMock();
    
    const mockResponse = {
      data: { id: 1, url_key: 'p1', status: 'available' },
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    };

    const postgrestMock = mockSupabase.from();
    postgrestMock.single.mockResolvedValueOnce(mockResponse);
    
    const result = await PermanentLinkManager.assignLink(productId);
    expect(result).toBe('p1');
    expect(mockSupabase.from).toHaveBeenCalledWith('permanent_links');
  });

  test('handles expired listings correctly', async () => {
    const expiredListingId = 'expired-listing';
    await PermanentLinkManager.releaseLink(expiredListingId);
    expect(createSupabaseMock().from).toHaveBeenCalledWith('permanent_links');
  });

  test('maintains URL structure consistency', async () => {
    const mockLink = await PermanentLinkManager.getProductByLink('p1');
    expect(mockLink).toBeDefined();
  });
});