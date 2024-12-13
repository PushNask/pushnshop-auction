import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DurationSectionProps {
  duration: '24' | '48' | '72' | '96' | '120';
  currency: 'XAF' | 'USD';
  onDurationChange: (value: '24' | '48' | '72' | '96' | '120') => void;
}

const DURATION_PRICES = {
  '24': { XAF: 5000, USD: 10 },
  '48': { XAF: 7500, USD: 15 },
  '72': { XAF: 10000, USD: 20 },
  '96': { XAF: 12500, USD: 25 },
  '120': { XAF: 15000, USD: 30 },
} as const;

export const DurationSection = ({
  duration,
  currency,
  onDurationChange
}: DurationSectionProps) => {
  return (
    <div>
      <Label>Listing Duration</Label>
      <Select
        value={duration}
        onValueChange={(value: '24' | '48' | '72' | '96' | '120') => onDurationChange(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(DURATION_PRICES).map(([hours, prices]) => (
            <SelectItem key={hours} value={hours}>
              {hours} hours - {currency === 'XAF' 
                ? `XAF ${prices.XAF.toLocaleString()}`
                : `$${prices.USD}`
              }
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};