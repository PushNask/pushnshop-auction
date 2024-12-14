import { supabase } from "@/integrations/supabase/client";
import type { Filters } from "@/types/filters";

interface ProductsResponse {
  products: any[];
  count: number;
}

export const fetchProducts = async (
  offset: number = 0,
  searchQuery: string = "",
  filters: Filters
): Promise<ProductsResponse> => {
  let query = supabase
    .from('products')
    .select('*, product_images(*)', { count: 'exact' });

  // Apply search filter if provided
  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`);
  }

  // Apply price filters if provided
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice < 1000000) {
    query = query.lte('price', filters.maxPrice);
  }

  // Apply status filter for in-stock items
  if (filters.inStock) {
    query = query.gt('quantity', 0);
  }

  // Apply ending soon filter
  if (filters.endingSoon) {
    const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    query = query.lte('end_time', twentyFourHoursFromNow);
  }

  // Apply location filter if provided
  if (filters.location) {
    query = query.eq('location', filters.location);
  }

  // Apply category filters if provided
  if (filters.categories.length > 0) {
    query = query.in('category', filters.categories);
  }

  // Add pagination
  query = query.range(offset, offset + 11);

  const { data: products, count, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return {
    products: products || [],
    count: count || 0
  };
};