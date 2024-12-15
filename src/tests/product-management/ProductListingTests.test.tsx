import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { ProductListingForm } from '@/components/products/ProductListingForm';
import { supabase } from '@/integrations/supabase/client';
import type { FormData } from '@/types/product-form';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
      }),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

describe('Product Listing Creation', () => {
  const mockSubmit = vi.fn();
  const mockFormData: FormData = {
    title: 'Test Product',
    description: 'Test Description',
    price: '100',
    currency: 'XAF',
    quantity: '1',
    duration: '24',
    whatsappNumber: '+237612345678',
    promotionRange: 'local',
    images: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('validates required fields', async () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  test('handles image upload and validation', async () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/drop images/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByAltText(/product image/i)).toBeInTheDocument();
    });
  });

  test('handles form submission', async () => {
    render(<ProductListingForm onSubmit={mockSubmit} initialData={mockFormData} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const priceInput = screen.getByLabelText(/price/i);
    
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(priceInput, { target: { value: '200' } });
    
    await waitFor(() => {
      expect(titleInput).toHaveValue('Updated Title');
      expect(priceInput).toHaveValue('200');
    });
  });
});