import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductImageGallery } from './ProductImageGallery';
import { uploadProductImage } from '@/utils/image-upload';
import type { ProductFormData } from '@/types/product-form';
import type { Currency } from '@/types/product';

interface ProductEditFormProps {
  productId?: string;
}

const ProductEditForm = ({ productId }: ProductEditFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<ProductFormData>({
    id: '',
    title: '',
    description: '',
    price: 0,
    currency: 'XAF',
    quantity: 0,
    images: []
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (productError) throw productError;

        const { data: imagesData, error: imagesError } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', productId)
          .order('order_index');

        if (imagesError) throw imagesError;

        setProduct({
          ...productData,
          currency: productData.currency as Currency,
          images: imagesData.map(img => ({
            id: img.id,
            url: img.url
          }))
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product data"
        });
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [productId, toast]);

  const handleImageAdd = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (product.images.length + files.length > 7) {
      setError('Maximum 7 images allowed');
      return;
    }

    const newImages = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      isNew: true,
      file
    }));

    setProduct(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleImageRemove = async (imageId: string) => {
    const image = product.images.find(img => img.id === imageId);
    if (!image) return;

    if (!image.isNew) {
      try {
        const { error } = await supabase
          .from('product_images')
          .delete()
          .eq('id', imageId);

        if (error) throw error;
      } catch (err) {
        console.error('Error removing image:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove image"
        });
        return;
      }
    }

    setProduct(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // Upload new images
      const newImages = product.images.filter(img => img.isNew && img.file);
      const uploadPromises = newImages.map(async (img) => {
        if (!img.file) return null;
        const publicUrl = await uploadProductImage(product.id, img.file);
        return {
          url: publicUrl,
          order_number: product.images.indexOf(img), // Changed from order_index to order_number
          product_id: product.id
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Update product data
      const { error: productError } = await supabase
        .from('products')
        .upsert({
          id: product.id || undefined,
          title: product.title,
          description: product.description,
          price: product.price,
          currency: product.currency,
          quantity: product.quantity,
          seller_id: supabase.auth.getUser()?.id // Add seller_id
        });

      if (productError) throw productError;

      // Update image records
      if (uploadedImages.length > 0) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(
            uploadedImages.filter(Boolean)
          );

        if (imagesError) throw imagesError;
      }

      toast({
        title: "Success",
        description: "Product saved successfully"
      });
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save changes');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product"
      });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={product.title}
                onChange={handleInputChange}
                placeholder="Product title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Product description"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ({product.currency})</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <Label htmlFor="quantity">Available Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <ProductImageGallery
              images={product.images}
              onImageAdd={handleImageAdd}
              onImageRemove={handleImageRemove}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProductEditForm;
