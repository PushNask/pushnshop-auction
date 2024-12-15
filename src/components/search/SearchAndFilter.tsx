import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';
import { FilterContent } from './FilterContent';
import { useProductSearch } from '@/hooks/useProductSearch';
import type { Filters } from '@/types/filters';

interface SearchAndFilterProps {
  filters: Filters;
  onFiltersChange: React.Dispatch<React.SetStateAction<Filters>>;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ filters, onFiltersChange }) => {
  const { isLoading } = useProductSearch(filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search products..."
          value={filters.search}
          onChange={handleSearchChange}
          disabled={isLoading}
        />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" disabled={isLoading}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchAndFilter;