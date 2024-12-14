import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadSection } from './ImageUploadSection';
import { BasicInfoSection } from './BasicInfoSection';
import { PriceSection } from './PriceSection';
import { CategorySection } from './CategorySection';
import { DurationSection } from './DurationSection';
import type { ProductImage, FormData } from '@/types/product-form';

export const EnhancedProductForm = () => {
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
    images: []
  });

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
      if (images.length === 0) {
        throw new Error('At least one image is required');
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
        quantity: 1,
        category: '',
        duration: '24'
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
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ImageUploadSection
            images={images}
            onImagesChange={setImages}
            error={error}
          />

          <div className="space-y-4">
            <BasicInfoSection
              title={formData.title}
              description={formData.description}
              quantity={formData.quantity}
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
                duration={formData.duration}
                currency={formData.currency}
                onDurationChange={(value) => setFormData(prev => ({
                  ...prev,
                  duration: value
                }))}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#0077B6] hover:bg-[#0077B6]/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Product
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default EnhancedProductForm;
