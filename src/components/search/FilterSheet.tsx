import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { FilterContent } from './FilterContent';
import type { Filters } from '@/types/filters';
import type { Dispatch, SetStateAction } from 'react';

interface FilterSheetProps {
  filters: Filters;
  onFiltersChange: Dispatch<SetStateAction<Filters>>;
}

export const FilterSheet = ({
  filters,
  onFiltersChange,
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
          onFiltersChange={onFiltersChange}
        />
      </div>
    </SheetContent>
  </Sheet>
);