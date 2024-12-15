import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';
import { FilterContent } from './FilterContent';
import { useProductSearch } from '@/hooks/useProductSearch';
import type { Filters } from '@/types/filters';

interface SearchAndFilterProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ filters, onFiltersChange }) => {
  const { isLoading, handleSearch, searchTerm } = useProductSearch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
    onFiltersChange({ ...filters, search: value });
  };

  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search products..."
          onChange={handleInputChange}
          value={filters.search}
          disabled={isLoading}
          className="w-full"
        />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" disabled={isLoading}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchAndFilter;