import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";
import { mapDbProductToProduct } from "@/utils/product";
import type { DbProduct } from "@/types/product";

export const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: async () => {
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

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      // Map the database response to our Product type
      return (data || []).map((item) => {
        // Ensure the item matches the DbProduct type structure
        const dbProduct: DbProduct = {
          ...item,
          product_images: item.product_images.map(img => ({
            ...img,
            product_id: img.product_id || item.id,
            created_at: img.created_at || new Date().toISOString()
          })),
          users: item.users || { whatsapp_number: null }
        };
        return mapDbProductToProduct(dbProduct);
      });
    },
    enabled: true,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return {
    products,
    isLoading,
    searchTerm,
    handleSearch,
  };
};