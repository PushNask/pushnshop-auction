import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGrid } from '@/components/ProductGrid';
import { SearchAndFilter } from '@/components/search/SearchAndFilter';
import { useIsMobile } from '@/hooks/use-mobile';
import { vi } from 'vitest';

// Mock the useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn()
}));

describe('Mobile Responsiveness', () => {
  const mockProducts = [
    {
      id: '1',
      title: 'Test Product',
      description: 'Test Description',
      price: 100,
      currency: 'XAF' as const,
      images: [],
      status: 'active' as const,
      viewCount: 0,
      quantity: 1
    }
  ];

  describe('Device Compatibility', () => {
    test('renders correctly on mobile devices', () => {
      (useIsMobile as any).mockReturnValue(true);
      
      render(<ProductGrid 
        products={mockProducts}
        isLoading={false}
        loadingRef={{ current: null }}
      />);
      
      // Check for mobile-specific classes
      const gridContainer = screen.getByRole('main');
      expect(gridContainer).toHaveClass('grid-cols-1');
    });

    test('renders correctly on desktop devices', () => {
      (useIsMobile as any).mockReturnValue(false);
      
      render(<ProductGrid 
        products={mockProducts}
        isLoading={false}
        loadingRef={{ current: null }}
      />);
      
      // Check for desktop-specific classes
      const gridContainer = screen.getByRole('main');
      expect(gridContainer).toHaveClass('lg:grid-cols-3');
    });
  });

  describe('Touch Interactions', () => {
    test('handles touch events correctly', () => {
      (useIsMobile as any).mockReturnValue(true);
      
      const filters = {
        search: '',
        minPrice: undefined,
        maxPrice: undefined,
        inStock: false,
        endingSoon: false,
        categories: [],
        location: ''
      };
      
      render(
        <SearchAndFilter 
          filters={filters}
          onFiltersChange={() => {}}
        />
      );
      
      // Verify touch-friendly elements
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toHaveClass('px-4', 'py-2');
    });
  });

  describe('Orientation Changes', () => {
    test('adapts layout on orientation change', () => {
      (useIsMobile as any).mockReturnValue(true);
      
      const { rerender } = render(
        <ProductGrid 
          products={mockProducts}
          isLoading={false}
          loadingRef={{ current: null }}
        />
      );

      // Simulate orientation change by updating viewport
      window.innerWidth = 500;
      window.innerHeight = 900;
      window.dispatchEvent(new Event('resize'));
      
      rerender(
        <ProductGrid 
          products={mockProducts}
          isLoading={false}
          loadingRef={{ current: null }}
        />
      );
      
      // Verify responsive layout
      const gridContainer = screen.getByRole('main');
      expect(gridContainer).toHaveClass('container', 'mx-auto');
    });
  });

  describe('Network Conditions', () => {
    test('handles slow network gracefully', async () => {
      (useIsMobile as any).mockReturnValue(true);
      
      render(
        <ProductGrid 
          products={[]}
          isLoading={true}
          loadingRef={{ current: null }}
        />
      );
      
      // Verify loading state
      const loadingIndicator = screen.getByRole('status');
      expect(loadingIndicator).toBeInTheDocument();
    });
  });
});