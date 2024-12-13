import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import type { FilterKey } from "@/types/filters";

interface AvailabilityFilterProps {
  inStock: boolean;
  endingSoon: boolean;
  onCheckboxChange: (key: FilterKey, checked: boolean) => void;
}

export const AvailabilityFilter = ({ 
  inStock, 
  endingSoon, 
  onCheckboxChange 
}: AvailabilityFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label>{t('products.filters.availability')}</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="inStock"
            checked={inStock}
            onCheckedChange={(checked) => 
              onCheckboxChange('inStock', checked === true)
            }
          />
          <label htmlFor="inStock">{t('products.filters.inStock')}</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="endingSoon"
            checked={endingSoon}
            onCheckedChange={(checked) => 
              onCheckboxChange('endingSoon', checked === true)
            }
          />
          <label htmlFor="endingSoon">{t('products.filters.endingSoon')}</label>
        </div>
      </div>
    </div>
  );
};