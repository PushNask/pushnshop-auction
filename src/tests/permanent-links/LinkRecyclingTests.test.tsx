import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PermanentLinkManager } from '@/lib/permanentLinks/PermanentLinkManager';
import { createSupabaseMock } from '../utils/supabaseMocks';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Link Recycling System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('recycles expired links automatically', async () => {
    const mockSupabase = createSupabaseMock();
    
    const mockExpiredLinks = {
      data: [{ id: 1, url_key: 'p1' }],
      error: null
    };

    mockSupabase.from().select.mockResolvedValueOnce(mockExpiredLinks);
    
    await PermanentLinkManager.recycleExpiredLinks();
    
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      status: 'available',
      current_listing_id: null
    });
  });

  test('maintains link history when recycling', async () => {
    const mockSupabase = createSupabaseMock();
    const linkId = 1;
    
    await PermanentLinkManager.recycleLink(linkId);
    
    expect(mockSupabase.from().update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'available',
        rotation_count: expect.any(Number)
      })
    );
  });
});