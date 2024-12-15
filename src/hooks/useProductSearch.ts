import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";

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
          )
        `);

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Product[];
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