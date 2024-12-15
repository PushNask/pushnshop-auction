import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductListingForm } from '@/components/products/ProductListingForm';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
      }),
    },
    from: vi.fn(),
  },
}));

describe('Product Listing Creation', () => {
  const mockSubmit = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('validates required fields', async () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /create listing/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
    });
  });

  test('handles image upload and validation', async () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload images/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
    });
  });

  test('validates price and currency inputs', async () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    
    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: '-100' } });
    
    await waitFor(() => {
      expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
    });
  });

  test('handles duration selection', async () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    
    const durationSelect = screen.getByLabelText(/duration/i);
    fireEvent.change(durationSelect, { target: { value: '48' } });
    
    await waitFor(() => {
      expect(durationSelect).toHaveValue('48');
    });
  });
});