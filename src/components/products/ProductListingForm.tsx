import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FormData, ApiResponse, PromotionRange } from '@/types/product-form';
import { ImageUploadSection } from '../product-listing/ImageUploadSection';
import { BasicInfoSection } from '../product-listing/BasicInfoSection';
import { PriceSection } from '../product-listing/PriceSection';
import { DurationSection } from '../product-listing/DurationSection';

interface ProductListingFormProps {
  onSubmit: (data: FormData) => Promise<ApiResponse<any>>;
  initialData?: Partial<FormData>;
}

export const ProductListingForm = ({
  onSubmit,
  initialData = {}
}: ProductListingFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    currency: 'XAF',
    quantity: '1',
    duration: '24',
    whatsappNumber: '',
    promotionRange: 'local',
    images: [],
    ...initialData
  });

  const validateWhatsappNumber = (number: string) => {
    const whatsappRegex = /^\+?[1-9]\d{1,14}$/;
    return whatsappRegex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      if (formData.images.length === 0) {
        throw new Error('At least one image is required');
      }

      const response = await onSubmit(formData);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <ImageUploadSection
          images={formData.images}
          onImagesChange={(images) => setFormData({ ...formData, images })}
        />

        <BasicInfoSection
          title={formData.title}
          description={formData.description}
          quantity={formData.quantity}
          whatsappNumber={formData.whatsappNumber}
          promotionRange={formData.promotionRange as PromotionRange}
          onChange={(e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
              ...prev,
              [name]: value
            }));
          }}
          errors={{}}
        />

        <div className="grid grid-cols-2 gap-4">
          <PriceSection
            price={formData.price}
            currency={formData.currency}
            onPriceChange={(e) => setFormData(prev => ({
              ...prev,
              price: e.target.value
            }))}
            onCurrencyChange={(value) => setFormData(prev => ({
              ...prev,
              currency: value
            }))}
          />

          <DurationSection
            duration={formData.duration as '24' | '48' | '72' | '96' | '120'}
            currency={formData.currency}
            onDurationChange={(value) => setFormData(prev => ({
              ...prev,
              duration: value
            }))}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full"
        >
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