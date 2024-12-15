import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createSupabaseMock } from '../utils/supabaseMocks';
import { SearchAndFilter } from '@/components/search/SearchAndFilter';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Search and Discovery System', () => {
  const mockSupabase = createSupabaseMock();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultFilters = {
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
    inStock: false,
    endingSoon: false,
    categories: [],
    location: ''
  };

  describe('Search Functionality', () => {
    test('performs basic search', async () => {
      mockSupabase.from().select.mockResolvedValueOnce({
        data: [{ id: 1, title: 'Test Product' }],
        error: null
      });

      render(
        <SearchAndFilter 
          filters={defaultFilters}
          onFiltersChange={() => {}}
        />
      );

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('products');
        expect(mockSupabase.from().select).toHaveBeenCalled();
      });
    });

    test('applies filters correctly', async () => {
      render(
        <SearchAndFilter 
          filters={defaultFilters}
          onFiltersChange={() => {}}
        />
      );

      const priceFilter = screen.getByLabelText(/price range/i);
      fireEvent.change(priceFilter, { target: { value: [0, 1000] } });

      await waitFor(() => {
        expect(mockSupabase.from().select).toHaveBeenCalledWith(
          expect.stringContaining('price')
        );
      });
    });

    test('handles pagination', async () => {
      mockSupabase.from().select.mockResolvedValueOnce({
        data: Array(20).fill({ id: 1, title: 'Test Product' }),
        error: null
      });

      render(
        <SearchAndFilter 
          filters={defaultFilters}
          onFiltersChange={() => {}}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockSupabase.from().select).toHaveBeenCalledWith(
          expect.stringContaining('range')
        );
      });
    });
  });
});