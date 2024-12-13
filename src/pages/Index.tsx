import { useState, useEffect, useRef, useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SearchAndFilter } from '@/components/search/SearchAndFilter';
import { Header } from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { fetchProducts } from '@/services/api';
import type { Product, Filters, SortOption } from '@/types/product';

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
    endingSoon: false
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  const loadingRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset products when search/filters/sort change
  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, [debouncedSearch, filters, sortBy]);

  // Fetch products
  const loadProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await fetchProducts(page, debouncedSearch, filters, sortBy);
      setProducts(prev => [...prev, ...result.products]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading products:', error);
    }
    setIsLoading(false);
  }, [page, debouncedSearch, filters, sortBy, hasMore, isLoading]);

  // Set up intersection observer
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
  }, []);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <SearchAndFilter 
        onSearch={handleSearch}
        onFiltersChange={handleFiltersChange}
      />
      <ProductGrid 
        products={products}
        isLoading={isLoading}
        loadingRef={loadingRef}
      />
    </div>
  );
};

export default HomePage;
