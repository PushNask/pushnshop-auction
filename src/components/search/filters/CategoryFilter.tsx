import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange 
}: CategoryFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label>{t('products.filters.categories')}</Label>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox 
              id={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={(checked) => 
                onCategoryChange(category, checked === true)
              }
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>
    </div>
  );
};