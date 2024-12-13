import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface LocationFilterProps {
  value: string;
  onChange: (location: string) => void;
}

export const LocationFilter = ({ value, onChange }: LocationFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label>{t('products.filters.location')}</Label>
      <Input
        placeholder={t('products.filters.location')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};