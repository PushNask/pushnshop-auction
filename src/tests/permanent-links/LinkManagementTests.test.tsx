import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createSupabaseMock } from '../utils/supabaseMocks';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';
import type { Database } from '@/integrations/supabase/types';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Permanent Link Management System', () => {
  const mockSupabase = createSupabaseMock();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Link Allocation', () => {
    test('allocates available link from the pool', async () => {
      const mockLink = { id: 1, url_key: 'p1', status: 'available' };
      mockSupabase.from().select().single.mockResolvedValueOnce({ data: mockLink, error: null });
      
      const result = await PermanentLinkManager.allocateLink();
      expect(result).toBeDefined();
      expect(result.url_key).toBe('p1');
    });

    test('handles allocation when no links are available', async () => {
      mockSupabase.from().select().single.mockResolvedValueOnce({ data: null, error: null });
      
      await expect(PermanentLinkManager.allocateLink()).rejects.toThrow();
    });
  });

  describe('Product Rotation', () => {
    test('rotates products when listing expires', async () => {
      const mockListing = {
        id: 'test-id',
        permanent_link_id: 1,
        status: 'active'
      };
      
      mockSupabase.from().update().mockResolvedValueOnce({ data: null, error: null });
      mockSupabase.rpc().mockResolvedValueOnce({ data: null, error: null });
      
      const result = await PermanentLinkManager.handleExpiredListing(mockListing);
      expect(result).toBeDefined();
    });
  });

  describe('Link Recycling', () => {
    test('recycles link after listing expiration', async () => {
      const mockLink = { id: 1, status: 'in_use' };
      mockSupabase.from().update().mockResolvedValueOnce({ data: mockLink, error: null });
      
      const result = await PermanentLinkManager.recyclePermanentLink(1);
      expect(result).toBeDefined();
    });
  });

  describe('URL Structure', () => {
    test('maintains consistent URL structure', () => {
      const url = PermanentLinkManager.generateUrlPath('p1');
      expect(url).toMatch(/^\/p\/p1$/);
    });

    test('handles invalid URL keys', () => {
      expect(() => PermanentLinkManager.generateUrlPath('')).toThrow();
    });
  });

  describe('404 Handling', () => {
    test('returns 404 for non-existent permanent links', async () => {
      mockSupabase.from().select().single.mockResolvedValueOnce({ data: null, error: null });
      
      const result = await PermanentLinkManager.getProductByLink('non-existent');
      expect(result).toBeNull();
    });
  });
});