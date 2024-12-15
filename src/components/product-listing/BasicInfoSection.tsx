import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PromotionRange } from '@/types/product-form';

interface BasicInfoSectionProps {
  title: string;
  description: string;
  quantity: string;
  whatsappNumber: string;
  promotionRange: PromotionRange;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: {
    title?: string;
    description?: string;
    quantity?: string;
    whatsappNumber?: string;
  };
}

export const BasicInfoSection = ({
  title,
  description,
  quantity,
  whatsappNumber,
  promotionRange,
  onChange,
  errors
}: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Product title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <span className="text-sm text-red-500">{errors.title}</span>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Product description"
          className={errors.description ? 'border-red-500' : ''}
          rows={4}
        />
        {errors.description && (
          <span className="text-sm text-red-500">{errors.description}</span>
        )}
      </div>

      <div>
        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
        <Input
          id="whatsappNumber"
          name="whatsappNumber"
          type="tel"
          value={whatsappNumber}
          onChange={onChange}
          placeholder="+237xxxxxxxxx"
          className={errors.whatsappNumber ? 'border-red-500' : ''}
        />
        {errors.whatsappNumber && (
          <span className="text-sm text-red-500">{errors.whatsappNumber}</span>
        )}
      </div>

      <div>
        <Label htmlFor="quantity">Quantity Available</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          value={quantity}
          onChange={onChange}
          placeholder="1"
          min="1"
          className={errors.quantity ? 'border-red-500' : ''}
        />
        {errors.quantity && (
          <span className="text-sm text-red-500">{errors.quantity}</span>
        )}
      </div>

      <div>
        <Label htmlFor="promotionRange">Promotion Range</Label>
        <Select
          value={promotionRange}
          onValueChange={(value: PromotionRange) => 
            onChange({
              target: { name: 'promotionRange', value }
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select promotion range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local (City)</SelectItem>
            <SelectItem value="regional">Regional</SelectItem>
            <SelectItem value="national">National</SelectItem>
            <SelectItem value="international">International</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};