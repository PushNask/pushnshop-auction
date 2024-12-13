import { useRef } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/api";
import type { Filters } from "@/types/filters";

const initialFilters: Filters = {
  search: '',
  minPrice: 0,
  maxPrice: 1000000,
  inStock: false,
  endingSoon: false,
  categories: [],
  location: ''
};

const HomePage = () => {
  const loadingRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(0, "", initialFilters),
  });

  return (
    <div className="container mx-auto p-4">
      <ProductGrid 
        products={data?.products || []}
        isLoading={isLoading}
        loadingRef={loadingRef}
      />
    </div>
  );
};

export default HomePage;