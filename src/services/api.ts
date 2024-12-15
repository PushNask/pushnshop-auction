import { supabase } from "@/integrations/supabase/client";
import { Product, ListingStatus } from "@/types/product";
import { Filters } from "@/types/filters";
import { mapDbProductToProduct } from "@/utils/product";

export const fetchProducts = async (filters: Filters): Promise<Product[]> => {
  let query = supabase
    .from("products")
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
    `)
    .order("created_at", { ascending: false });

  // Apply filters
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return (data || []).map(mapDbProductToProduct);
};