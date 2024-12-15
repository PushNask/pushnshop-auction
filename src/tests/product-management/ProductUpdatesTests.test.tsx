import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createSupabaseMock } from '../utils/supabaseMocks';
import { ProductManagementSystem } from '@/components/product-management/ProductManagementSystem';
import type { Product } from '@/types/product';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Product Management System', () => {
  const mockSupabase = createSupabaseMock();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Real-time Updates', () => {
    test('updates product data in real-time', async () => {
      const mockProduct: Product = {
        id: '1',
        title: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'XAF',
        quantity: 5,
        status: 'active',
        images: [],
        viewCount: 0
      };

      const channel = mockSupabase.channel('products');
      channel.on = vi.fn().mockReturnThis();
      channel.subscribe = vi.fn().mockResolvedValue({ data: null, error: null });

      render(<ProductManagementSystem />);

      // Simulate real-time update
      await waitFor(() => {
        channel.emit('UPDATE', { new: { ...mockProduct, price: 150 } });
      });

      expect(screen.getByText('150')).toBeInTheDocument();
    });
  });

  describe('Inventory Management', () => {
    test('updates product quantity', async () => {
      render(<ProductManagementSystem />);
      
      const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      
      await waitFor(() => {
        expect(mockSupabase.from().update).toHaveBeenCalledWith(
          expect.objectContaining({ quantity: 10 })
        );
      });
    });
  });
});