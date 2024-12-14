import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Duration = '24' | '48' | '72' | '96' | '120';

interface DurationSectionProps {
  duration: Duration;
  currency: 'XAF' | 'USD';
  onDurationChange: (value: Duration) => void;
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
        onValueChange={(value: Duration) => onDurationChange(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(DURATION_PRICES) as Duration[]).map((hours) => (
            <SelectItem key={hours} value={hours}>
              {hours} hours - {currency === 'XAF' 
                ? `XAF ${DURATION_PRICES[hours].XAF.toLocaleString()}`
                : `$${DURATION_PRICES[hours].USD}`
              }
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};