import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Menu, SlidersHorizontal, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

// Mock API call - replace with actual Supabase query
const fetchProducts = async (page = 0, searchQuery = '', filters = {}, sortBy = 'newest') => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockProducts = Array(12).fill(null).map((_, i) => ({
    id: page * 12 + i,
    title: `Product ${page * 12 + i + 1}`,
    price: Math.floor(Math.random() * 900) + 100,
    timeLeft: '23:59:59',
    quantity: Math.floor(Math.random() * 10) + 1,
    description: 'Product description preview'
  }));

  return {
    products: mockProducts,
    hasMore: page < 4 // Simulate 5 pages of data
  };
};

interface Product {
  id: number;
  title: string;
  price: number;
  timeLeft: string;
  quantity: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden">
      <div className="relative aspect-square bg-gray-100">
        <img
          src="/placeholder.svg"
          alt={product.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
          {product.timeLeft}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold">${product.price}</span>
          <span className="text-sm text-gray-500">{product.quantity} available</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-3">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <MessageCircle size={20} />
          Contact Seller
        </Button>
      </CardFooter>
    </Card>
  );
};

interface FilterSheetProps {
  filters: {
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
    endingSoon: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
    endingSoon: boolean;
  }>>;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ filters, setFilters }) => (
  <div className="py-4 space-y-6">
    <div className="space-y-4">
      <h4 className="font-medium">Price Range</h4>
      <div className="px-2">
        <Slider
          defaultValue={[filters.minPrice || 0, filters.maxPrice || 1000]}
          max={1000}
          step={10}
          onValueChange={([min, max]) => 
            setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))
          }
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>${filters.minPrice || 0}</span>
          <span>${filters.maxPrice || 1000}</span>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h4 className="font-medium">Availability</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) =>
              setFilters(prev => ({ ...prev, inStock: checked }))
            }
          />
          <label htmlFor="in-stock">In Stock</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="ending-soon"
            checked={filters.endingSoon}
            onCheckedChange={(checked) =>
              setFilters(prev => ({ ...prev, endingSoon: checked }))
            }
          />
          <label htmlFor="ending-soon">Ending Soon</label>
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
    endingSoon: false
  });
  const [sortBy, setSortBy] = useState('newest');
  
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

  // Initial load
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

          <Select value={sortBy} onValueChange={setSortBy}>
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
        
        {/* Infinite scroll trigger */}
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

export default Index;