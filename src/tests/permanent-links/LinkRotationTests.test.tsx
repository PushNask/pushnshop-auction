import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';
import { createSupabaseMock } from '../utils/supabaseMocks';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Link Rotation System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('rotates links based on performance score', async () => {
    const mockSupabase = createSupabaseMock();
    
    const mockLinks = {
      data: [
        { id: 1, url_key: 'p1', performance_score: 0.8 },
        { id: 2, url_key: 'p2', performance_score: 0.5 }
      ],
      error: null
    };

    mockSupabase.from().select.mockResolvedValueOnce(mockLinks);
    
    const result = await PermanentLinkManager.getNextAvailableLink();
    expect(result.url_key).toBe('p1');
  });

  test('handles expired listings correctly', async () => {
    const expiredListingId = 'expired-listing';
    const mockSupabase = createSupabaseMock();
    
    await PermanentLinkManager.releaseLink(expiredListingId);
    
    expect(mockSupabase.from).toHaveBeenCalledWith('permanent_links');
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      current_listing_id: null,
      status: 'available'
    });
  });
});