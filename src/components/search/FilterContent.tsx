import { Filters, FilterKey } from "@/types/filters";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";

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
      <div className="space-y-2">
        <Label>{t('products.filters.priceRange')}</Label>
        <Slider
          defaultValue={filters.priceRange}
          max={1000000}
          step={1000}
          onValueChange={(value) => onPriceChange(value as [number, number])}
        />
        <div className="flex justify-between text-sm">
          <span>{filters.priceRange[0].toLocaleString()} XAF</span>
          <span>{filters.priceRange[1].toLocaleString()} XAF</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('products.filters.availability')}</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => 
                onCheckboxChange('inStock', checked === true)
              }
            />
            <label htmlFor="inStock">{t('products.filters.inStock')}</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="endingSoon"
              checked={filters.endingSoon}
              onCheckedChange={(checked) => 
                onCheckboxChange('endingSoon', checked === true)
              }
            />
            <label htmlFor="endingSoon">{t('products.filters.endingSoon')}</label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('products.filters.categories')}</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => 
                  onCategoryChange(category, checked === true)
                }
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('products.filters.location')}</Label>
        <Input
          placeholder={t('products.filters.location')}
          value={filters.location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>

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