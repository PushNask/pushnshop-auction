import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, DbProduct } from "@/types/product";
import { mapDbProductToProduct } from "@/utils/product";
import { useState, useCallback } from "react";

export const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const query = useQuery({
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
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map((item: DbProduct) => mapDbProductToProduct(item));
    }
  });

  return {
    ...query,
    handleSearch,
    searchTerm,
    isLoading: query.isLoading
  };
};