import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';
import { createSupabaseMock } from '../utils/supabaseMocks';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Link Allocation System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('allocates new link successfully', async () => {
    const productId = 'test-product-id';
    const mockSupabase = createSupabaseMock();
    
    const mockResponse = {
      data: { id: 1, url_key: 'p1', status: 'available' },
      error: null
    };

    const postgrestMock = mockSupabase.from();
    postgrestMock.single.mockResolvedValueOnce(mockResponse);
    
    const result = await PermanentLinkManager.assignLink(productId);
    expect(result).toBe('p1');
  });

  test('handles allocation when no links available', async () => {
    const productId = 'test-product-id';
    const mockSupabase = createSupabaseMock();
    
    // First query returns no available links
    mockSupabase.from().single.mockRejectedValueOnce(new Error('No links available'));
    
    // Second query returns oldest active link
    const mockOldestLink = {
      data: { id: 1, url_key: 'p1', status: 'active' },
      error: null
    };
    mockSupabase.from().single.mockResolvedValueOnce(mockOldestLink);
    
    const result = await PermanentLinkManager.assignLink(productId);
    expect(result).toBe('p1');
  });
});