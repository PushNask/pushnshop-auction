import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { BasicInfoSection } from './product-listing/BasicInfoSection';
import { PriceSection } from './product-listing/PriceSection';
import { DurationSection } from './product-listing/DurationSection';
import { ImageUploadSection } from './product-listing/ImageUploadSection';
import type { ProductImage } from '@/types/product';

interface FormData {
  title: string;
  description: string;
  price: string;
  currency: 'XAF' | 'USD';
  quantity: string;
  duration: '24' | '48' | '72' | '96' | '120';
  images: ProductImage[];
}

interface FormErrors extends Partial<Record<keyof FormData, string>> {
  submit?: string;
}

const ProductListingForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    currency: 'XAF',
    quantity: '',
    duration: '24',
    images: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleCurrencyChange = (value: 'XAF' | 'USD') => {
    setFormData(prev => ({ ...prev, currency: value }));
  };

  const handleDurationChange = (value: '24' | '48' | '72' | '96' | '120') => {
    setFormData(prev => ({ ...prev, duration: value }));
  };

  const handleImagesChange = (newImages: ProductImage[]) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    setErrors(prev => ({ ...prev, images: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success!",
        description: "Your listing has been created.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'XAF',
        quantity: '',
        duration: '24',
        images: [],
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create listing. Please try again.'
      }));
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create listing. Please try again.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Listing</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <BasicInfoSection
            title={formData.title}
            description={formData.description}
            quantity={formData.quantity}
            onChange={handleInputChange}
            errors={{
              title: errors.title,
              description: errors.description,
              quantity: errors.quantity
            }}
          />

          <PriceSection
            price={formData.price}
            currency={formData.currency}
            onPriceChange={handleInputChange}
            onCurrencyChange={handleCurrencyChange}
            priceError={errors.price}
          />

          <DurationSection
            duration={formData.duration}
            currency={formData.currency}
            onDurationChange={handleDurationChange}
          />

          <ImageUploadSection
            images={formData.images}
            onImagesChange={handleImagesChange}
            error={errors.images}
          />

          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#0077B6] hover:bg-[#0077B6]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Listing...
              </>
            ) : (
              'Create Listing'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProductListingForm;