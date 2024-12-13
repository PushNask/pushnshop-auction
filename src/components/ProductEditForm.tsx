import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImagePlus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProductImage {
  id: string;
  url: string;
  isNew?: boolean;
  file?: File;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'XAF' | 'USD';
  quantity: number;
  images: ProductImage[];
}

const ProductEditForm = ({ productId }: { productId?: string }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product>({
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

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${product.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

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
        const publicUrl = await uploadImage(img.file);
        return {
          url: publicUrl,
          order_index: product.images.indexOf(img)
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
          quantity: product.quantity
        });

      if (productError) throw productError;

      // Update image records
      if (uploadedImages.length > 0) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(
            uploadedImages.filter(Boolean).map(img => ({
              product_id: product.id,
              ...img
            }))
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

            <div>
              <Label>Product Images ({product.images.length}/7)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                {product.images.map((image) => (
                  <div key={image.id} className="relative aspect-square">
                    <img
                      src={image.url}
                      alt="Product"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageRemove(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {product.images.length < 7 && (
                  <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center p-4"
                    >
                      <ImagePlus className="h-8 w-8 mb-2" />
                      <span className="text-sm text-center">Add Image</span>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageAdd}
                        multiple
                      />
                    </Label>
                  </div>
                )}
              </div>
            </div>
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