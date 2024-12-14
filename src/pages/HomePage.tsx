import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/api";
import type { Filters } from "@/types/filters";
import { useToast } from "@/hooks/use-toast";
import { ProductGrid } from "@/components/ProductGrid";
import { SearchAndFilter } from "@/components/search/SearchAndFilter";
import { ActiveFilters } from "@/components/search/ActiveFilters";

const initialFilters: Filters = {
  search: '',
  minPrice: undefined,
  maxPrice: undefined,
  currency: undefined,
  inStock: false,
  endingSoon: false,
  categories: [],
  location: ''
};

const HomePage = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const loadingRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    meta: {
      errorHandler: (err: Error) => {
        console.error('Error fetching products:', err);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive"
        });
      }
    }
  });

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleCheckboxChange = (key: 'inStock' | 'endingSoon', checked: boolean) => {
    setFilters(prev => ({ ...prev, [key]: checked }));
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600">Failed to load products</h2>
        <p className="text-gray-600 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <SearchAndFilter 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      
      {(filters.categories.length > 0 || filters.inStock || filters.endingSoon) && (
        <div className="mb-4">
          <ActiveFilters
            filters={filters}
            onClearFilters={handleClearFilters}
            onCategoryChange={handleCategoryChange}
            onCheckboxChange={handleCheckboxChange}
          />
        </div>
      )}

      <ProductGrid 
        products={products || []}
        isLoading={isLoading}
        loadingRef={loadingRef}
      />
    </div>
  );
};

export default HomePage;