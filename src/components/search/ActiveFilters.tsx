import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Filters } from '@/types/filters';

interface ActiveFiltersProps {
  filters: Filters;
  onClearFilters: () => void;
  onCategoryChange: (category: string, checked: boolean) => void;
  onCheckboxChange: (key: 'inStock' | 'endingSoon', checked: boolean) => void;
}

export const ActiveFilters = ({
  filters,
  onClearFilters,
  onCategoryChange,
  onCheckboxChange,
}: ActiveFiltersProps) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-2">
    <Button 
      variant="secondary" 
      size="sm"
      onClick={onClearFilters}
    >
      <X className="w-4 h-4 mr-1" />
      Clear All
    </Button>
    {filters.categories.map(category => (
      <Button
        key={category}
        variant="outline"
        size="sm"
        onClick={() => onCategoryChange(category, false)}
      >
        {category}
        <X className="w-4 h-4 ml-1" />
      </Button>
    ))}
    {filters.inStock && (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onCheckboxChange('inStock', false)}
      >
        In Stock
        <X className="w-4 h-4 ml-1" />
      </Button>
    )}
    {filters.endingSoon && (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onCheckboxChange('endingSoon', false)}
      >
        Ending Soon
        <X className="w-4 h-4 ml-1" />
      </Button>
    )}
  </div>
);