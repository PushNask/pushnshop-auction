import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, AlertCircle, ImagePlus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';
import type { FormData, ProductImage } from '@/types/product-form';

interface ProductListingFormProps {
  onSubmit: (data: FormData) => Promise<{
    data: any | null;
    error: { message: string } | null;
  }>;
}

const DURATION_PRICES = {
  '24': { XAF: 5000, USD: 10 },
  '48': { XAF: 7500, USD: 15 },
  '72': { XAF: 10000, USD: 20 },
  '96': { XAF: 12500, USD: 25 },
  '120': { XAF: 15000, USD: 30 },
} as const;

export const ProductListingForm = ({ onSubmit }: ProductListingFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    currency: 'XAF',
    quantity: '1',
    duration: '24',
    whatsappNumber: '',
    promotionRange: 'local',
    images: []
  });

  const validateWhatsappNumber = (number: string) => {
    const whatsappRegex = /^\+?[1-9]\d{1,14}$/;
    return whatsappRegex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.whatsappNumber) {
        throw new Error('WhatsApp number is required');
      }
      if (!validateWhatsappNumber(formData.whatsappNumber)) {
        throw new Error('Please enter a valid WhatsApp number');
      }
      if (images.length === 0) {
        throw new Error('At least one image is required');
      }

      const response = await onSubmit({ ...formData, images });
      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'XAF',
        quantity: '1',
        duration: '24',
        whatsappNumber: '',
        promotionRange: 'local',
        images: []
      });
      setImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Images
              </label>
              <ImageUpload
                images={images}
                onChange={setImages}
                error={error}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                maxLength={80}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Enter product title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                maxLength={2000}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Describe your product"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'XAF' | 'USD' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="XAF">XAF</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity Available
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="+237xxxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Promotion Range
              </label>
              <select
                value={formData.promotionRange}
                onChange={(e) => setFormData({ ...formData, promotionRange: e.target.value as 'local' | 'regional' | 'national' | 'international' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="local">Local</option>
                <option value="regional">Regional</option>
                <option value="national">National</option>
                <option value="international">International</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Listing Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                {Object.entries(DURATION_PRICES).map(([hours, prices]) => (
                  <option key={hours} value={hours}>
                    {hours} hours - {formData.currency === 'XAF' 
                      ? `${prices.XAF.toLocaleString()} XAF`
                      : `$${prices.USD}`
                    }
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Listing...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Listing
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProductListingForm;