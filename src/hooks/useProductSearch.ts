import { useState, useCallback } from "react";
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
            order_number
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
        throw error;
      }

      // Map the database response to our Product type
      return (data || []).map((item: DbProduct) => mapDbProductToProduct(item));
    },
    enabled: true,
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    products,
    isLoading,
    searchTerm,
    handleSearch,
  };
};