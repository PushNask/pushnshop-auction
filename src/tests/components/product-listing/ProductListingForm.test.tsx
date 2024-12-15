import { render, screen, fireEvent } from '@testing-library/react';
import { ProductListingForm } from '@/components/products/ProductListingForm';
import { vi } from 'vitest';

describe('ProductListingForm', () => {
  const mockSubmit = vi.fn().mockImplementation(async () => ({ data: null, error: null }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    expect(screen.getByLabelText(/Product Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload Images/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Product Title/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'This is a test product.' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(mockSubmit).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalledWith(expect.any(FormData));
  });

  it('displays validation errors', async () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(await screen.findByText(/Product Title is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Price is required/i)).toBeInTheDocument();
  });
});
