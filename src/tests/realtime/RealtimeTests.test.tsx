import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { LiveProduct } from '@/components/product/LiveProduct';
import { mockChannel, createSupabaseMock } from '../utils/supabaseMocks';
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';

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
    render(<LiveProduct productId="1" />);
    
    const subscribeCallback = vi.mocked(mockChannel.subscribe).mock.calls[0][0];
    if (subscribeCallback) {
      subscribeCallback(REALTIME_SUBSCRIBE_STATES.CLOSED, new Error('Connection lost'));
      subscribeCallback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
    }
    
    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalledTimes(1);
    });
  });

  test('synchronizes data across clients', async () => {
    render(<LiveProduct productId="1" />);
    
    const mockPayload = {
      new: { price: 200, currency: 'XAF' },
      old: { price: 100, currency: 'XAF' }
    };

    const onCallback = vi.mocked(mockChannel.on).mock.calls[0][2];
    if (onCallback) onCallback(mockPayload);
    
    await waitFor(() => {
      expect(screen.getByText('XAF 200')).toBeInTheDocument();
    });
  });
});