import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductManagement } from '@/components/product-management/ProductManagement';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }),
  },
}));

describe('Product Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('handles real-time updates', async () => {
    const mockProduct = {
      id: '1',
      title: 'Test Product',
      price: 100,
      status: 'active',
    };

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => Promise.resolve({ data: [mockProduct], error: null }),
    }));

    render(<ProductManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  test('updates product status', async () => {
    const mockProduct = {
      id: '1',
      title: 'Test Product',
      status: 'active',
    };

    render(<ProductManagement initialProduct={mockProduct} />);
    
    const statusButton = screen.getByRole('button', { name: /deactivate/i });
    fireEvent.click(statusButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('products');
    });
  });

  test('handles batch updates', async () => {
    const mockProducts = [
      { id: '1', title: 'Product 1', status: 'active' },
      { id: '2', title: 'Product 2', status: 'active' },
    ];

    render(<ProductManagement initialProducts={mockProducts} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => fireEvent.click(checkbox));
    
    const batchActionButton = screen.getByRole('button', { name: /batch action/i });
    fireEvent.click(batchActionButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('products');
    });
  });
});