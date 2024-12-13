import { Filters, FilterKey } from "@/types/filters";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { AvailabilityFilter } from "./filters/AvailabilityFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { LocationFilter } from "./filters/LocationFilter";

interface FilterContentProps {
  filters: Filters;
  categories: string[];
  isFilterActive: boolean;
  onPriceChange: (value: [number, number]) => void;
  onCheckboxChange: (key: FilterKey, checked: boolean) => void;
  onCategoryChange: (category: string, checked: boolean) => void;
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
}

export const FilterContent = ({
  filters,
  categories,
  isFilterActive,
  onPriceChange,
  onCheckboxChange,
  onCategoryChange,
  onLocationChange,
  onClearFilters,
}: FilterContentProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PriceRangeFilter 
        value={filters.priceRange}
        onChange={onPriceChange}
      />

      <AvailabilityFilter 
        inStock={filters.inStock}
        endingSoon={filters.endingSoon}
        onCheckboxChange={onCheckboxChange}
      />

      <CategoryFilter 
        categories={categories}
        selectedCategories={filters.categories}
        onCategoryChange={onCategoryChange}
      />

      <LocationFilter 
        value={filters.location}
        onChange={onLocationChange}
      />

      {isFilterActive && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onClearFilters}
        >
          <FilterX className="w-4 h-4 mr-2" />
          {t('products.filters.clearFilters')}
        </Button>
      )}
    </div>
  );
};