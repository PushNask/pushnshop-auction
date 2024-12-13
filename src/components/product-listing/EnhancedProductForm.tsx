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
import { supabase } from '@/integrations/supabase/client';
import { ImageUploadSection } from './ImageUploadSection';
import { BasicInfoSection } from './BasicInfoSection';
import { PriceSection } from './PriceSection';
import { CategorySection } from './CategorySection';
import { DurationSection } from './DurationSection';
import type { ProductImage } from '@/types/product-form';

interface FormData {
  title: string;
  description: string;
  price: string;
  currency: 'XAF' | 'USD';
  quantity: number;
  category: string;
  duration: '24' | '48' | '72' | '96' | '120';
}

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
    quantity: 1,
    category: '',
    duration: '24'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to create a listing');

      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.description.trim()) throw new Error('Description is required');
      if (images.length === 0) throw new Error('At least one image is required');

      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          currency: formData.currency,
          quantity: formData.quantity,
          seller_id: user.id,
          status: 'draft'
        })
        .select()
        .single();

      if (productError) throw productError;

      // Upload images
      const imageUploads = images.map(async (image, index) => {
        const fileExt = image.file.name.split('.').pop();
        const filePath = `${product.id}/${index}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, image.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return {
          product_id: product.id,
          url: publicUrl,
          alt: formData.title,
          order_number: index
        };
      });

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(await Promise.all(imageUploads));

      if (imagesError) throw imagesError;

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
      console.error('Error creating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product');
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to create product',
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
              onChange={(field, value) => setFormData(prev => ({
                ...prev,
                [field]: value
              }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <PriceSection
                price={formData.price}
                currency={formData.currency}
                onPriceChange={(value) => setFormData(prev => ({
                  ...prev,
                  price: value
                }))}
                onCurrencyChange={(value) => setFormData(prev => ({
                  ...prev,
                  currency: value
                }))}
              />

              <CategorySection
                value={formData.category}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  category: value
                }))}
              />
            </div>

            <DurationSection
              duration={formData.duration}
              currency={formData.currency}
              onDurationChange={(value) => setFormData(prev => ({
                ...prev,
                duration: value
              }))}
            />
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