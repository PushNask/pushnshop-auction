import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';
import { mapDbProductToProduct } from '@/utils/product';

interface SearchFilters {
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

export const useProductSearch = (initialFilters: SearchFilters = {}) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('products')
          .select(`
            *,
            product_images (
              id,
              url,
              alt,
              order_number
            ),
            users!products_seller_id_fkey (
              whatsapp_number
            )
          `);

        // Apply text search if query exists
        if (filters.query) {
          query = query.textSearch('searchable', filters.query);
        }

        // Apply price filters
        if (filters.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice);
        }

        // Apply status filter
        if (filters.status) {
          query = query.eq('status', filters.status);
        }

        // Apply sorting
        if (filters.sortBy) {
          query = query.order(filters.sortBy, { 
            ascending: filters.sortOrder === 'asc'
          });
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        if (data) {
          const mappedProducts = data.map(mapDbProductToProduct);
          setResults(mappedProducts);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { results, loading, error, setFilters };
};