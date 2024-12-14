import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Filters } from "@/types/filters";

export const fetchProducts = async (filters: Filters): Promise<Product[]> => {
  let query = supabase
    .from("products")
    .select(`
      *,
      product_images (
        url,
        alt,
        order_number
      )
    `)
    .order("created_at", { ascending: false });

  // Apply search filter
  if (filters.search) {
    const searchQuery = filters.search.trim();
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // Apply price filters if provided
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice < 1000000) {
    query = query.lte("price", filters.maxPrice);
  }

  // Apply stock filter
  if (filters.inStock) {
    query = query.gt("quantity", 0);
  }

  // Apply ending soon filter
  if (filters.endingSoon) {
    const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    query = query.lt("end_time", twentyFourHoursFromNow);
  }

  // Apply category filters
  if (filters.categories.length > 0) {
    query = query.in("category", filters.categories);
  }

  // Apply location filter
  if (filters.location) {
    query = query.eq("location", filters.location);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data || [];
};