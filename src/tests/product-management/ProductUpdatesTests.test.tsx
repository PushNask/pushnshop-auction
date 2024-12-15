import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { ProductManagement } from '@/components/product-management/ProductManagement';
import { supabase } from '@/integrations/supabase/client';
import type { ManagedProduct } from '@/types/product-management';

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
          quantity: 1,
          currency: 'XAF'
        },
        error: null
      }),
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
  },
}));

describe('Product Updates', () => {
  const mockProduct: ManagedProduct = {
    id: '1',
    title: 'Test Product',
    price: 100,
    currency: 'XAF',
    status: 'active',
    quantity: 1,
    views: 0,
    whatsappClicks: 0
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('handles real-time updates', async () => {
    render(<ProductManagement />);
    
    await waitFor(() => {
      expect(supabase.channel).toHaveBeenCalled();
    });
  });

  test('updates product status', async () => {
    render(<ProductManagement />);
    
    const statusButton = await screen.findByRole('button', { name: /deactivate/i });
    fireEvent.click(statusButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('products');
    });
  });

  test('handles batch updates', async () => {
    const mockProducts = [mockProduct];
    render(<ProductManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('My Products')).toBeInTheDocument();
    });

    const checkboxes = await screen.findAllByRole('checkbox');
    checkboxes.forEach(checkbox => fireEvent.click(checkbox));
    
    const batchActionButton = screen.getByRole('button', { name: /batch/i });
    fireEvent.click(batchActionButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('products');
    });
  });

  test('updates inventory quantity', async () => {
    render(<ProductManagement />);
    
    const quantityInput = await screen.findByRole('spinbutton', { name: /quantity/i });
    fireEvent.change(quantityInput, { target: { value: '5' } });
    
    await waitFor(() => {
      expect(quantityInput).toHaveValue(5);
    });
  });
});