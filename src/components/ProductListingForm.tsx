import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import type { FormData, ApiResponse } from '@/types/product-form';
import { ImageUploadSection } from '../product-listing/ImageUploadSection';

interface ProductListingFormProps {
  onSubmit: (data: FormData) => Promise<ApiResponse<any>>;
  initialData?: Partial<FormData>;
}

export const ProductListingForm = ({
  onSubmit,
  initialData = {}
}: ProductListingFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    currency: 'XAF',
    quantity: '1',
    duration: '24',
    images: [],
    ...initialData
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await onSubmit(formData);
      if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />

          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value as 'XAF' | 'USD' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XAF">XAF</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ImageUploadSection
          images={formData.images}
          onImagesChange={(images) => setFormData({ ...formData, images })}
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Create Listing'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductListingForm;
