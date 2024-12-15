import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { LiveProduct } from '@/components/product/LiveProduct';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Create a mock channel that satisfies the RealtimeChannel interface
const createMockChannel = (): RealtimeChannel => ({
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn().mockResolvedValue({ state: 'SUBSCRIBED' }),
  unsubscribe: vi.fn(),
  send: vi.fn(),
  track: vi.fn(),
  untrack: vi.fn(),
  on_broadcast: vi.fn(),
  on_presence: vi.fn(),
  on_postgres_changes: vi.fn(),
  topic: '',
  params: {},
  socket: {} as any,
  bindings: [],
  state: 'SUBSCRIBED',
  presenceState: vi.fn(),
  joinedOnce: false,
  rejoinTimer: null,
  rejoinAttempts: 0,
  timeout: vi.fn(),
  push: vi.fn(),
  leave: vi.fn(),
  trigger: vi.fn(),
  cancelRejoin: vi.fn(),
  rejoin: vi.fn(),
  clearHeartbeat: vi.fn(),
  startHeartbeat: vi.fn(),
  stopHeartbeat: vi.fn(),
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    channel: vi.fn(() => createMockChannel()),
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '1',
          title: 'Test Product',
          price: 100,
          status: 'active'
        },
        error: null
      })
    }))
  }
}));

describe('Realtime Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('establishes WebSocket connection', async () => {
    render(<LiveProduct productId="1" />);
    
    await waitFor(() => {
      expect(supabase.channel).toHaveBeenCalled();
    });
  });

  test('handles connection recovery', async () => {
    const mockChannel = createMockChannel();
    vi.mocked(supabase.channel).mockReturnValue(mockChannel);

    render(<LiveProduct productId="1" />);
    
    // Simulate connection drop and recovery
    mockChannel.subscribe.mockRejectedValueOnce(new Error('Connection lost'))
      .mockResolvedValueOnce({ state: 'SUBSCRIBED' });

    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalledTimes(2);
    });
  });

  test('synchronizes data across clients', async () => {
    const mockChannel = createMockChannel();
    vi.mocked(supabase.channel).mockReturnValue(mockChannel);

    render(<LiveProduct productId="1" />);
    
    // Simulate receiving update
    const mockPayload = {
      new: { price: 200 },
      old: { price: 100 }
    };

    // Get the callback function that was passed to on()
    const onCallback = vi.mocked(mockChannel.on).mock.calls[0][2];
    onCallback(mockPayload);
    
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