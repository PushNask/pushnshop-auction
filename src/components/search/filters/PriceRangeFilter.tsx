import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "react-i18next";

interface PriceRangeFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const PriceRangeFilter = ({ value, onChange }: PriceRangeFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label>{t('products.filters.priceRange')}</Label>
      <Slider
        defaultValue={value}
        max={1000000}
        step={1000}
        onValueChange={(value) => onChange(value as [number, number])}
      />
      <div className="flex justify-between text-sm">
        <span>{value[0].toLocaleString()} XAF</span>
        <span>{value[1].toLocaleString()} XAF</span>
      </div>
    </div>
  );
};