import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { FilterContent } from './FilterContent';
import { FilterSheet } from './FilterSheet';
import { ActiveFilters } from './ActiveFilters';
import type { Filters, FilterKey } from '@/types/filters';

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Others'
];

const INITIAL_FILTERS: Filters = {
  priceRange: [0, 1000000],
  inStock: false,
  endingSoon: false,
  categories: [],
  location: ''
};

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: Filters) => void;
}

export const SearchAndFilter = ({ onSearch, onFiltersChange }: SearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handlePriceChange = (value: [number, number]) => {
    const newFilters = { ...filters, priceRange: value };
    setFilters(newFilters);
    setIsFilterActive(true);
    onFiltersChange(newFilters);
  };

  const handleCheckboxChange = (key: FilterKey, checked: boolean) => {
    const newFilters = { ...filters, [key]: checked };
    setFilters(newFilters);
    setIsFilterActive(true);
    onFiltersChange(newFilters);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newFilters = {
      ...filters,
      categories: checked 
        ? [...filters.categories, category]
        : filters.categories.filter(c => c !== category)
    };
    setFilters(newFilters);
    setIsFilterActive(true);
    onFiltersChange(newFilters);
  };

  const handleLocationChange = (location: string) => {
    const newFilters = { ...filters, location };
    setFilters(newFilters);
    setIsFilterActive(true);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setIsFilterActive(false);
    onFiltersChange(INITIAL_FILTERS);
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
          <FilterSheet
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

        {isFilterActive && (
          <ActiveFilters
            filters={filters}
            onClearFilters={clearFilters}
            onCategoryChange={handleCategoryChange}
            onCheckboxChange={handleCheckboxChange}
          />
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;