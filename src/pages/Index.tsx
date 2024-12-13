import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Menu, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FilterSheet } from '@/components/FilterSheet';
import { ProductCard } from '@/components/ProductCard';
import { Product, Filters, SortOption } from '@/types/product';

// Mock API call - replace with actual Supabase query
const fetchProducts = async (page = 0, searchQuery = '', filters = {}, sortBy: SortOption = 'newest') => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockProducts = Array(12).fill(null).map((_, i) => ({
    id: `${page * 12 + i}`,
    permanentLinkId: (page * 12 + i) % 120 + 1,
    title: `Product ${page * 12 + i + 1}`,
    price: Math.floor(Math.random() * 900) + 100,
    description: 'Product description preview',
    quantity: Math.floor(Math.random() * 10) + 1,
    images: [{
      id: '1',
      url: '/placeholder.svg',
      alt: `Product ${page * 12 + i + 1}`,
      order: 1
    }],
    status: 'active',
    sellerId: '123',
    sellerWhatsApp: '1234567890',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    viewCount: 0
  }));

  return {
    products: mockProducts,
    hasMore: page < 4 // Simulate 5 pages of data
  };
};

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-4">
                  <ul className="space-y-2">
                    <li><Button variant="ghost" className="w-full justify-start">Home</Button></li>
                    <li><Button variant="ghost" className="w-full justify-start">Sell Item</Button></li>
                    <li><Button variant="ghost" className="w-full justify-start">My Account</Button></li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-bold">PushNshop</h1>

            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search size={24} />
            </Button>

            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-4">
              <Button variant="ghost">Sell Item</Button>
              <Button variant="ghost">My Account</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="lg:hidden p-4 bg-white border-b">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal size={20} />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterSheet filters={filters} setFilters={setFilters} />
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="flex">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div
          ref={loadingRef}
          className="flex justify-center items-center py-8"
        >
          {isLoading && (
            <Loader2 className="w-6 h-6 animate-spin" />
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
