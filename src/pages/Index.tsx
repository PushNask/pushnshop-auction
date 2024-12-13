import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { SearchAndFilter } from '@/components/search/SearchAndFilter';
import { ProductGrid } from '@/components/ProductGrid';
import { fetchProducts } from '@/services/api';
import type { Product } from '@/types/product';
import type { Filters } from '@/types/filters';

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000000],
    inStock: false,
    endingSoon: false,
    categories: [],
    location: ''
  });
  
  const loadingRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await fetchProducts(page, searchQuery, filters);
      setProducts(prev => [...prev, ...result.products]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading products:', error);
    }
    setIsLoading(false);
  }, [page, searchQuery, filters, hasMore, isLoading]);

  useEffect(() => {
    if (loadingRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadProducts();
          }
        },
        { threshold: 1.0 }
      );

      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadProducts]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="container mx-auto px-4 py-8">
        <SearchAndFilter 
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
        />
        <div className="mt-8">
          <ProductGrid 
            products={products}
            isLoading={isLoading}
            loadingRef={loadingRef}
          />
        </div>
      </main>
    </div>
  );
};

export default HomePage;