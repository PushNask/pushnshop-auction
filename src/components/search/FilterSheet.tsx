import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { FilterContent } from './FilterContent';
import type { Filters, FilterKey } from '@/types/filters';

interface FilterSheetProps {
  filters: Filters;
  categories: string[];
  isFilterActive: boolean;
  onPriceChange: (value: [number, number]) => void;
  onCheckboxChange: (key: FilterKey, checked: boolean) => void;
  onCategoryChange: (category: string, checked: boolean) => void;
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
}

export const FilterSheet = ({
  filters,
  categories,
  isFilterActive,
  onPriceChange,
  onCheckboxChange,
  onCategoryChange,
  onLocationChange,
  onClearFilters,
}: FilterSheetProps) => (
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
          categories={categories}
          isFilterActive={isFilterActive}
          onPriceChange={onPriceChange}
          onCheckboxChange={onCheckboxChange}
          onCategoryChange={onCategoryChange}
          onLocationChange={onLocationChange}
          onClearFilters={onClearFilters}
        />
      </div>
    </SheetContent>
  </Sheet>
);