import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product, DbProduct } from '@/types/product';
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
              order_number,
              product_id,
              created_at
            ),
            users!products_seller_id_fkey (
              whatsapp_number
            )
          `);

        if (filters.query) {
          query = query.textSearch('searchable', filters.query);
        }

        if (filters.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice);
        }

        if (filters.status) {
          query = query.eq('status', filters.status);
        }

        if (filters.sortBy) {
          query = query.order(filters.sortBy, { 
            ascending: filters.sortOrder === 'asc'
          });
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        if (data) {
          const mappedProducts = data.map((item: DbProduct) => mapDbProductToProduct(item));
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