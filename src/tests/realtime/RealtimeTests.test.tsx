import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { createSupabaseMock } from '../utils/supabaseMocks';
import { ProductManagementSystem } from '@/components/product-management/ProductManagementSystem';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Realtime Features', () => {
  const mockSupabase = createSupabaseMock();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('WebSocket Connections', () => {
    test('establishes realtime connection', async () => {
      const channel = mockSupabase.channel('products');
      channel.subscribe = vi.fn().mockResolvedValue({ data: null, error: null });

      render(<ProductManagementSystem />);

      await waitFor(() => {
        expect(mockSupabase.channel).toHaveBeenCalledWith('products');
        expect(channel.subscribe).toHaveBeenCalled();
      });
    });

    test('handles connection recovery', async () => {
      const channel = mockSupabase.channel('products');
      channel.subscribe = vi.fn()
        .mockRejectedValueOnce(new Error('Connection lost'))
        .mockResolvedValueOnce({ data: null, error: null });

      render(<ProductManagementSystem />);

      await waitFor(() => {
        expect(channel.subscribe).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Data Synchronization', () => {
    test('syncs product updates in real-time', async () => {
      const channel = mockSupabase.channel('products');
      const mockProduct = {
        id: '1',
        title: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'XAF',
        quantity: 1,
        images: [],
        status: 'active',
        viewCount: 0
      };

      render(<ProductManagementSystem />);

      await waitFor(() => {
        channel.emit('UPDATE', { new: { ...mockProduct, price: 150 } });
        expect(screen.getByText('150')).toBeInTheDocument();
      });
    });
  });
});