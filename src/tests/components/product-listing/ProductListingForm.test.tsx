import { render, screen } from '@testing-library/react';
import { ProductListingForm } from '@/components/ProductListingForm';
import type { FormData } from '@/types/product-form';

describe('ProductListingForm', () => {
  const mockSubmit = async (data: FormData) => {
    console.log('Form submitted:', data);
  };

  it('renders correctly', () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    expect(screen.getByText(/Create Listing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    const submitButton = screen.getByRole('button', { name: /Create Listing/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it('validates required fields', () => {
    render(<ProductListingForm onSubmit={mockSubmit} />);
    const submitButton = screen.getByRole('button', { name: /Create Listing/i });
    submitButton.click();
    
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Price is required/i)).toBeInTheDocument();
    expect(screen.getByText(/At least one image is required/i)).toBeInTheDocument();
  });
});