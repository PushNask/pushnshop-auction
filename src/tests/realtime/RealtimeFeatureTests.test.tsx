import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { LiveProduct } from '@/components/product/LiveProduct';
import { mockChannel, createSupabaseMock } from '../utils/supabaseMocks';

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
    
    const subscribeCallback = mockChannel.subscribe.mock.calls[0][0];
    if (subscribeCallback) {
      subscribeCallback('CLOSED', new Error('Connection lost'));
      subscribeCallback('SUBSCRIBED');
    }
    
    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalledTimes(1);
    });
  });

  test('synchronizes data across clients', async () => {
    render(<LiveProduct productId="1" />);
    
    const mockPayload = {
      new: { price: 200 },
      old: { price: 100 }
    };

    const onCallback = mockChannel.on.mock.calls[0][2];
    if (onCallback) onCallback(mockPayload);
    
    await waitFor(() => {
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });
});