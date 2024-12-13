import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Search,
  SlidersHorizontal,
  X,
  FilterX
} from 'lucide-react';

interface Filters {
  priceRange: [number, number];
  inStock: boolean;
  endingSoon: boolean;
  categories: string[];
  location: string;
}

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: Filters) => void;
}

export const SearchAndFilter = ({ onSearch, onFiltersChange }: SearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000000], // XAF
    inStock: false,
    endingSoon: false,
    categories: [],
    location: ''
  });
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Mock categories - replace with actual data
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Others'
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value
    }));
    setIsFilterActive(true);
    onFiltersChange({ ...filters, priceRange: value });
  };

  const handleCheckboxChange = (key: keyof Filters, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked
    }));
    setIsFilterActive(true);
    onFiltersChange({ ...filters, [key]: checked });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
    setIsFilterActive(true);
    onFiltersChange({ ...filters, categories: checked 
        ? [...filters.categories, category]
        : filters.categories.filter(c => c !== category) });
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000000],
      inStock: false,
      endingSoon: false,
      categories: [],
      location: ''
    });
    setIsFilterActive(false);
    onFiltersChange({
      priceRange: [0, 1000000],
      inStock: false,
      endingSoon: false,
      categories: [],
      location: ''
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div className="space-y-2">
        <Label>Price Range (XAF)</Label>
        <Slider
          defaultValue={filters.priceRange}
          max={1000000}
          step={1000}
          onValueChange={handlePriceChange}
        />
        <div className="flex justify-between text-sm">
          <span>{filters.priceRange[0].toLocaleString()} XAF</span>
          <span>{filters.priceRange[1].toLocaleString()} XAF</span>
        </div>
      </div>

      {/* Status Filters */}
      <div className="space-y-2">
        <Label>Status</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => 
                handleCheckboxChange('inStock', checked)
              }
            />
            <label htmlFor="inStock">In Stock</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="endingSoon"
              checked={filters.endingSoon}
              onCheckedChange={(checked) => 
                handleCheckboxChange('endingSoon', checked)
              }
            />
            <label htmlFor="endingSoon">Ending Soon</label>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category, checked)
                }
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          placeholder="Enter location"
          value={filters.location}
          onChange={(e) => {
            setFilters(prev => ({
              ...prev,
              location: e.target.value
            }));
            setIsFilterActive(true);
            onFiltersChange({ ...filters, location: e.target.value });
          }}
        />
      </div>

      {/* Clear Filters */}
      {isFilterActive && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={clearFilters}
        >
          <FilterX className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex gap-6">
        {/* Filter Sidebar */}
        <Card className="w-64 shrink-0">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>

        {/* Search and Results */}
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

      {/* Mobile Layout */}
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
                <FilterContent />
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
