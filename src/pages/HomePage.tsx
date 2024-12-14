import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/api";
import type { Filters } from "@/types/filters";
import { useToast } from "@/hooks/use-toast";
import { ProductGrid } from "@/components/ProductGrid";

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
  const loadingRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(initialFilters),
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
      <ProductGrid 
        products={products || []}
        isLoading={isLoading}
        loadingRef={loadingRef}
      />
    </div>
  );
};

export default HomePage;