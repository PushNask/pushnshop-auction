import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageUploadSection } from '@/components/product-listing/ImageUploadSection';

describe('ImageUploadSection', () => {
  const mockProps = {
    images: [],
    imageUrls: [],
    onImagesChange: vi.fn(),
    onImageRemove: vi.fn(),
  };

  it('renders upload button when below max images', () => {
    render(<ImageUploadSection {...mockProps} />);
    expect(screen.getByText(/add image/i)).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<ImageUploadSection {...mockProps} error="Test error" />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('shows correct image count', () => {
    render(<ImageUploadSection {...mockProps} />);
    expect(screen.getByText('Product Images (0/7)')).toBeInTheDocument();
  });

  it('hides upload button when max images reached', () => {
    const props = {
      ...mockProps,
      images: Array(7).fill(new File([], 'test.jpg')),
      imageUrls: Array(7).fill('test-url'),
    };
    render(<ImageUploadSection {...props} />);
    expect(screen.queryByText(/add image/i)).not.toBeInTheDocument();
  });
});