import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { LiveProduct } from '@/components/product/LiveProduct';
import { createSupabaseMock, createMockRealtimeChannel, mockChannel } from '../utils/supabaseMocks';

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
      expect(mockChannel.subscribe).toHaveBeenCalled();
    });
  });

  test('handles connection recovery', async () => {
    const customMockChannel = createMockRealtimeChannel();
    customMockChannel.subscribe = vi.fn()
      .mockImplementationOnce((callback) => {
        if (callback) callback('CLOSED' as REALTIME_SUBSCRIBE_STATES, new Error('Connection lost'));
        return customMockChannel;
      })
      .mockImplementationOnce((callback) => {
        if (callback) callback('SUBSCRIBED' as REALTIME_SUBSCRIBE_STATES);
        return customMockChannel;
      });

    render(<LiveProduct productId="1" />);
    
    await waitFor(() => {
      expect(customMockChannel.subscribe).toHaveBeenCalledTimes(2);
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
});