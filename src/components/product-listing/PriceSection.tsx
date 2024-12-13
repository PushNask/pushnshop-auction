import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PriceSectionProps {
  price: string;
  currency: 'XAF' | 'USD';
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCurrencyChange: (value: 'XAF' | 'USD') => void;
  priceError?: string;
}

export const PriceSection = ({
  price,
  currency,
  onPriceChange,
  onCurrencyChange,
  priceError
}: PriceSectionProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={price}
          onChange={onPriceChange}
          placeholder="0.00"
          className={priceError ? 'border-red-500' : ''}
        />
        {priceError && (
          <span className="text-sm text-red-500">{priceError}</span>
        )}
      </div>

      <div className="w-32">
        <Label>Currency</Label>
        <Select
          value={currency}
          onValueChange={(value: 'XAF' | 'USD') => onCurrencyChange(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="XAF">XAF</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};