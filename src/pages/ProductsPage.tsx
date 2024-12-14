import { useQuery } from "@tanstack/react-query";
import { SearchAndFilter } from "@/components/search/SearchAndFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { fetchProducts } from "@/services/api";
import { Filters } from "@/types/filters";
import { useState, useRef } from "react";

const ProductsPage = () => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    minPrice: undefined,
    maxPrice: undefined,
    currency: undefined,
    inStock: false,
    endingSoon: false,
    categories: [],
    location: "",
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <SearchAndFilter filters={filters} onFiltersChange={setFilters} />
      <ProductGrid 
        products={products || []} 
        isLoading={isLoading} 
        loadingRef={loadingRef}
      />
    </div>
  );
};

export default ProductsPage;