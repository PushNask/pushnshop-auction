import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { LiveProduct } from '@/components/product/LiveProduct';
import { createSupabaseMock, mockChannel } from '../utils/supabaseMocks';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Realtime Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('establishes WebSocket connection', async () => {
    render(<LiveProduct productId="1" />);
    
    await waitFor(() => {
      expect(createSupabaseMock().channel).toHaveBeenCalled();
    });
  });

  test('handles connection recovery', async () => {
    vi.mocked(mockChannel.subscribe).mockImplementationOnce((callback) => {
      if (callback) callback('CLOSED', new Error('Connection lost'));
      return mockChannel;
    }).mockImplementationOnce((callback) => {
      if (callback) callback('SUBSCRIBED');
      return mockChannel;
    });

    render(<LiveProduct productId="1" />);
    
    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalledTimes(2);
    });
  });

  test('synchronizes data across clients', async () => {
    render(<LiveProduct productId="1" />);
    
    const mockPayload = {
      new: { price: 200 },
      old: { price: 100 }
    };

    const onCallback = vi.mocked(mockChannel.on).mock.calls[0][2];
    if (onCallback) onCallback(mockPayload);
    
    await waitFor(() => {
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  test('handles concurrent updates', async () => {
    const mockChannel = createMockChannel();
    vi.mocked(supabase.channel).mockReturnValue(mockChannel);

    render(<LiveProduct productId="1" />);
    
    const updates = [
      { new: { price: 200 } },
      { new: { price: 300 } },
      { new: { price: 400 } }
    ];

    const onCallback = vi.mocked(mockChannel.on).mock.calls[0][2];
    updates.forEach(update => {
      onCallback(update);
    });
    
    await waitFor(() => {
      expect(screen.getByText('400')).toBeInTheDocument();
    });
  });
});
