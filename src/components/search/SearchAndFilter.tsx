import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { FilterContent } from './FilterContent';
import type { Filters, FilterKey } from '@/types/filters';

const INITIAL_FILTERS: Filters = {
  priceRange: [0, 1000000],
  inStock: false,
  endingSoon: false,
  categories: [],
  location: ''
};

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Others'
];

export const SearchAndFilter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Implement search logic
  };

  const handlePriceChange = (value: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value
    }));
    setIsFilterActive(true);
  };

  const handleCheckboxChange = (key: FilterKey, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked
    }));
    setIsFilterActive(true);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
    setIsFilterActive(true);
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({
      ...prev,
      location
    }));
    setIsFilterActive(true);
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setIsFilterActive(false);
  };

  return (
    <div className="w-full">
      <div className="hidden md:flex gap-6">
        <Card className="w-64 shrink-0">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent 
              filters={filters}
              categories={CATEGORIES}
              isFilterActive={isFilterActive}
              onPriceChange={handlePriceChange}
              onCheckboxChange={handleCheckboxChange}
              onCategoryChange={handleCategoryChange}
              onLocationChange={handleLocationChange}
              onClearFilters={clearFilters}
            />
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {isFilterActive && (
              <Button variant="outline">
                {filters.categories.length + 
                  (filters.inStock ? 1 : 0) + 
                  (filters.endingSoon ? 1 : 0) + 
                  (filters.location ? 1 : 0)
                } filters applied
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              className="pl-10"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FilterContent 
                  filters={filters}
                  categories={CATEGORIES}
                  isFilterActive={isFilterActive}
                  onPriceChange={handlePriceChange}
                  onCheckboxChange={handleCheckboxChange}
                  onCategoryChange={handleCategoryChange}
                  onLocationChange={handleLocationChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {isFilterActive && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={clearFilters}
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
            {filters.categories.map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => handleCategoryChange(category, false)}
              >
                {category}
                <X className="w-4 h-4 ml-1" />
              </Button>
            ))}
            {filters.inStock && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCheckboxChange('inStock', false)}
              >
                In Stock
                <X className="w-4 h-4 ml-1" />
              </Button>
            )}
            {filters.endingSoon && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCheckboxChange('endingSoon', false)}
              >
                Ending Soon
                <X className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
