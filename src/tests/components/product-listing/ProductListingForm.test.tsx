import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductListingForm from '@/components/ProductListingForm';
import { useToast } from '@/components/ui/use-toast';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ProductListingForm', () => {
  it('renders all form sections', () => {
    render(<ProductListingForm />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByText(/listing duration/i)).toBeInTheDocument();
    expect(screen.getByText(/product images/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<ProductListingForm />);
    
    const submitButton = screen.getByRole('button', { name: /create listing/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/valid price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/valid quantity is required/i)).toBeInTheDocument();
      expect(screen.getByText(/at least one image is required/i)).toBeInTheDocument();
    });
  });

  it('updates form values when input changes', () => {
    render(<ProductListingForm />);
    
    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Product' } });
    expect(titleInput).toHaveValue('Test Product');

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    expect(descriptionInput).toHaveValue('Test Description');

    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: '100' } });
    expect(priceInput).toHaveValue('100');

    const quantityInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(quantityInput, { target: { value: '5' } });
    expect(quantityInput).toHaveValue('5');
  });
});