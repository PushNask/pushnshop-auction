import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';
import { createSupabaseMock } from '../utils/supabaseMocks';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Permanent Link Management System', () => {
  const mockSupabase = createSupabaseMock();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Link Allocation', () => {
    test('allocates links correctly', async () => {
      const productId = 'test-product-id';
      const mockResponse = {
        data: { id: 1, url_key: 'p1', status: 'available' },
        error: null
      };

      mockSupabase.from().select.mockResolvedValueOnce(mockResponse);
      
      const result = await PermanentLinkManager.assignLink(productId);
      expect(result).toBe('p1');
      expect(mockSupabase.from).toHaveBeenCalledWith('permanent_links');
    });
  });

  describe('Product Rotation', () => {
    test('handles expired listings correctly', async () => {
      const expiredListingId = 'expired-listing';
      await PermanentLinkManager.releaseLink(expiredListingId);
      expect(mockSupabase.from).toHaveBeenCalledWith('permanent_links');
    });
  });

  describe('URL Structure', () => {
    test('maintains URL structure consistency', async () => {
      const mockLink = await PermanentLinkManager.getProductByLink('p1');
      expect(mockLink).toBeDefined();
    });
  });
});