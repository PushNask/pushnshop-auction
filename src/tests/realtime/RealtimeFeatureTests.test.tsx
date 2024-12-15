import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { LiveProduct } from '@/components/product/LiveProduct';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn()
    })),
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
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn()
    };
    vi.mocked(supabase.channel).mockReturnValue(mockChannel);

    render(<LiveProduct productId="1" />);
    
    // Simulate connection drop and recovery
    mockChannel.subscribe.mockImplementationOnce(() => {
      throw new Error('Connection lost');
    });

    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalledTimes(2);
    });
  });

  test('synchronizes data across clients', async () => {
    render(<LiveProduct productId="1" />);
    
    const channel = supabase.channel();
    const mockPayload = {
      new: { price: 200 },
      old: { price: 100 }
    };

    channel.on.mock.calls[0][2](mockPayload);
    
    await waitFor(() => {
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  test('handles concurrent updates', async () => {
    render(<LiveProduct productId="1" />);
    
    const channel = supabase.channel();
    const updates = [
      { new: { price: 200 } },
      { new: { price: 300 } },
      { new: { price: 400 } }
    ];

    updates.forEach(update => {
      channel.on.mock.calls[0][2](update);
    });
    
    await waitFor(() => {
      expect(screen.getByText('400')).toBeInTheDocument();
    });
  });
});