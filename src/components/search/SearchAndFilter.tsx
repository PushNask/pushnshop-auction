import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import { FilterContent } from "./FilterContent";
import { useProductSearch } from "@/hooks/useProductSearch";
import type { Filters } from "@/types/filters";
import type { Dispatch, SetStateAction } from "react";

export interface SearchAndFilterProps {
  filters: Filters;
  onFiltersChange: Dispatch<SetStateAction<Filters>>;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ filters, onFiltersChange }) => {
  const { loading } = useProductSearch(filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={handleSearchChange}
          disabled={loading}
        />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" disabled={loading}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
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