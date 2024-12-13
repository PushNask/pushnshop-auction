import { useRef, useState } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { SearchAndFilter } from "@/components/search/SearchAndFilter";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/api";
import type { Filters } from "@/types/filters";

const INITIAL_FILTERS: Filters = {
  minPrice: 0,
  maxPrice: 1000000,
  inStock: false,
  endingSoon: false,
  categories: [],
  location: ""
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  
  const loadingRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', searchQuery, filters],
    queryFn: () => fetchProducts(0, searchQuery, filters),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <SearchAndFilter 
        onSearch={handleSearch}
        onFiltersChange={handleFiltersChange}
      />
      <ProductGrid 
        products={data?.products || []}
        isLoading={isLoading}
        loadingRef={loadingRef}
      />
    </div>
  );
};

export default HomePage;