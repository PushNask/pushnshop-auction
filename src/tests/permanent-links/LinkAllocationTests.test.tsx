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
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    };

    const postgrestMock = mockSupabase.from();
    vi.spyOn(postgrestMock, 'single').mockResolvedValueOnce(mockResponse);
    
    const result = await PermanentLinkManager.assignLink(productId);
    expect(result).toBe('p1');
    expect(mockSupabase.from).toHaveBeenCalledWith('permanent_links');
  });

  test('handles allocation when no links available', async () => {
    const productId = 'test-product-id';
    const mockSupabase = createSupabaseMock();
    const postgrestMock = mockSupabase.from();
    
    // First query returns no available links
    vi.spyOn(postgrestMock, 'single').mockRejectedValueOnce(new Error('No links available'));
    
    // Second query returns oldest active link
    const mockOldestLink = {
      data: { id: 1, url_key: 'p1', status: 'active' },
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    };
    vi.spyOn(postgrestMock, 'single').mockResolvedValueOnce(mockOldestLink);
    
    const result = await PermanentLinkManager.assignLink(productId);
    expect(result).toBe('p1');
  });
});