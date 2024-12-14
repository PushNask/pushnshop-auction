import { Filters, FilterKey } from "@/types/filters";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { AvailabilityFilter } from "./filters/AvailabilityFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { LocationFilter } from "./filters/LocationFilter";
import type { Dispatch, SetStateAction } from "react";

interface FilterContentProps {
  filters: Filters;
  onFiltersChange: Dispatch<SetStateAction<Filters>>;
}

export const FilterContent = ({
  filters,
  onFiltersChange,
}: FilterContentProps) => {
  const { t } = useTranslation();

  const handlePriceChange = (value: [number, number]) => {
    onFiltersChange(prev => ({ ...prev, minPrice: value[0], maxPrice: value[1] }));
  };

  const handleCheckboxChange = (key: FilterKey, checked: boolean) => {
    onFiltersChange(prev => ({ ...prev, [key]: checked }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFiltersChange(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleLocationChange = (location: string) => {
    onFiltersChange(prev => ({ ...prev, location }));
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      minPrice: undefined,
      maxPrice: undefined,
      inStock: false,
      endingSoon: false,
      categories: [],
      location: "",
    });
  };

  const isFilterActive = 
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStock ||
    filters.endingSoon ||
    filters.categories.length > 0 ||
    filters.location !== "";

  return (
    <div className="space-y-6">
      <PriceRangeFilter 
        value={[filters.minPrice || 0, filters.maxPrice || 1000000]}
        onChange={handlePriceChange}
      />

      <AvailabilityFilter 
        inStock={filters.inStock}
        endingSoon={filters.endingSoon}
        onCheckboxChange={handleCheckboxChange}
      />

      <CategoryFilter 
        categories={["Electronics", "Fashion", "Home", "Sports"]} // Add your categories here
        selectedCategories={filters.categories}
        onCategoryChange={handleCategoryChange}
      />

      <LocationFilter 
        value={filters.location}
        onChange={handleLocationChange}
      />

      {isFilterActive && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleClearFilters}
        >
          <FilterX className="w-4 h-4 mr-2" />
          {t('products.filters.clearFilters')}
        </Button>
      )}
    </div>
  );
};