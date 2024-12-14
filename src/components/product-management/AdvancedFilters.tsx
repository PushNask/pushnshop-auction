import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export interface FilterState {
  status: string[];
  priceRange: [number, number];
  categories: string[];
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const STATUSES = ['active', 'inactive', 'pending', 'archived'];
const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Others'];

export const AdvancedFilters = ({ onFilterChange }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priceRange: [0, 1000000],
    categories: [],
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    handleFilterChange('status', newStatuses);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    handleFilterChange('categories', newCategories);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      status: [],
      priceRange: [0, 1000000],
      categories: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div className="space-y-4">
        <div>
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {STATUSES.map(status => (
              <Badge
                key={status}
                variant={filters.status.includes(status) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleStatusToggle(status)}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Price Range</Label>
          <div className="pt-2 px-2">
            <Slider
              defaultValue={filters.priceRange}
              max={1000000}
              step={1000}
              onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-muted-foreground">
                ${filters.priceRange[0].toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                ${filters.priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div>
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {CATEGORIES.map(category => (
              <Badge
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};