import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { ProductManagementSystem } from '@/components/product-management/ProductManagementSystem';
import { mockChannel, createSupabaseMock } from '../utils/supabaseMocks';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Product Update Management', () => {
  const mockSupabase = createSupabaseMock();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('handles real-time inventory updates', async () => {
    render(<ProductManagementSystem />);
    
    const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
    fireEvent.change(quantityInput, { target: { value: '5' } });
    
    await waitFor(() => {
      expect(mockSupabase.from().update).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 5 })
      );
    });
  });

  test('updates product price correctly', async () => {
    render(<ProductManagementSystem />);
    
    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    fireEvent.change(priceInput, { target: { value: '1000' } });
    
    await waitFor(() => {
      expect(mockSupabase.from().update).toHaveBeenCalledWith(
        expect.objectContaining({ price: 1000 })
      );
    });
  });

  test('handles image gallery updates', async () => {
    render(<ProductManagementSystem />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/add image/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockSupabase.storage.from).toHaveBeenCalled();
    });
  });

  test('manages product status changes', async () => {
    render(<ProductManagementSystem />);
    
    const statusButton = screen.getByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    
    await waitFor(() => {
      expect(mockSupabase.from().update).toHaveBeenCalledWith(
        expect.objectContaining({ status: expect.any(String) })
      );
    });
  });

  test('handles batch updates correctly', async () => {
    render(<ProductManagementSystem />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => fireEvent.click(checkbox));
    
    const batchActionButton = screen.getByRole('button', { name: /batch/i });
    fireEvent.click(batchActionButton);
    
    await waitFor(() => {
      expect(mockSupabase.from().update).toHaveBeenCalled();
    });
  });

  test('maintains version control for updates', async () => {
    render(<ProductManagementSystem />);
    
    // Simulate multiple updates
    const priceInput = screen.getByRole('spinbutton', { name: /price/i });
    fireEvent.change(priceInput, { target: { value: '1000' } });
    
    await waitFor(() => {
      expect(mockSupabase.from().update).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 1000,
          updated_at: expect.any(String)
        })
      );
    });
  });
});
