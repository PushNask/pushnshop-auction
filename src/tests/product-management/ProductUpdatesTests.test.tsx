import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { ProductManagementSystem } from '@/components/product-management/ProductManagementSystem';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '1',
          title: 'Test Product',
          price: 100,
          status: 'active',
          quantity: 1
        },
        error: null
      })
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn()
    }))
  }
}));

describe('Product Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('handles real-time updates', async () => {
    render(<ProductManagementSystem />);
    
    await waitFor(() => {
      expect(supabase.channel).toHaveBeenCalled();
    });
  });

  test('updates inventory quantity', async () => {
    render(<ProductManagementSystem />);
    
    const quantityInput = await screen.findByRole('spinbutton', { name: /quantity/i });
    fireEvent.change(quantityInput, { target: { value: '5' } });
    
    await waitFor(() => {
      expect(quantityInput).toHaveValue(5);
      expect(supabase.from().update).toHaveBeenCalled();
    });
  });

  test('handles batch updates', async () => {
    render(<ProductManagementSystem />);
    
    const checkboxes = await screen.findAllByRole('checkbox');
    checkboxes.forEach(checkbox => fireEvent.click(checkbox));
    
    const batchActionButton = screen.getByRole('button', { name: /batch/i });
    fireEvent.click(batchActionButton);
    
    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalled();
    });
  });

  test('updates product status', async () => {
    render(<ProductManagementSystem />);
    
    const statusButton = await screen.findByRole('button', { name: /status/i });
    fireEvent.click(statusButton);
    
    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalled();
    });
  });

  test('handles image gallery updates', async () => {
    render(<ProductManagementSystem />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/add image/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalled();
    });
  });
});