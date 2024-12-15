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
        price: 100,
        quantity: 5,
        status: 'active'
      };

      mockSupabase.channel().on.mockReturnThis();
      mockSupabase.channel().subscribe.mockResolvedValueOnce({ data: null, error: null });

      render(<ProductManagementSystem initialProduct={mockProduct} />);

      // Simulate real-time update
      const channel = mockSupabase.channel('products');
      channel.emit('UPDATE', { new: { ...mockProduct, price: 150 } });

      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument();
      });
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

  describe('Status Changes', () => {
    test('handles product status updates', async () => {
      render(<ProductManagementSystem />);
      
      const statusButton = screen.getByRole('button', { name: /status/i });
      fireEvent.click(statusButton);
      
      const activeOption = screen.getByText(/active/i);
      fireEvent.click(activeOption);
      
      await waitFor(() => {
        expect(mockSupabase.from().update).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'active' })
        );
      });
    });
  });

  describe('Batch Updates', () => {
    test('processes batch status updates', async () => {
      render(<ProductManagementSystem />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => fireEvent.click(checkbox));
      
      const batchUpdateButton = screen.getByRole('button', { name: /batch/i });
      fireEvent.click(batchUpdateButton);
      
      await waitFor(() => {
        expect(mockSupabase.from().update).toHaveBeenCalled();
      });
    });
  });

  describe('Version Control', () => {
    test('maintains update history', async () => {
      render(<ProductManagementSystem />);
      
      const priceInput = screen.getByRole('spinbutton', { name: /price/i });
      fireEvent.change(priceInput, { target: { value: '200' } });
      
      await waitFor(() => {
        expect(mockSupabase.from().update).toHaveBeenCalledWith(
          expect.objectContaining({
            price: 200,
            updated_at: expect.any(String)
          })
        );
      });
    });
  });
});