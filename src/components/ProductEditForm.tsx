import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadProductImage } from '@/lib/storage';
import type { Product } from '@/types/product';

interface ProductEditFormProps {
  initialProduct: Partial<Product>;
  onSuccess?: () => void;
}

export const ProductEditForm = ({ initialProduct, onSuccess }: ProductEditFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: 0,
    currency: 'XAF',
    quantity: 1,
    images: [],
    ...initialProduct
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      alt: file.name,
      order: product.images?.length || 0 + index,
      file
    }));

    setProduct(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const uploadedImages = await Promise.all(
        product.images.map(async (img) => {
          if (!img.file) return null;
          const publicUrl = await uploadProductImage(product.id, img.file);
          return {
            url: publicUrl,
            order_number: product.images.indexOf(img),
            product_id: product.id
          };
        })
      );

      const { error: productError } = await supabase
        .from('products')
        .update({
          title: product.title,
          description: product.description,
          price: product.price,
          currency: product.currency,
          quantity: product.quantity,
          seller_id: user.id
        })
        .eq('id', product.id);

      if (productError) throw productError;

      if (uploadedImages.some(Boolean)) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(uploadedImages.filter(Boolean));

        if (imagesError) throw imagesError;
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update product',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={product.quantity}
            onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Images</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        {product.images && product.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {product.images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt={img.alt}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating Product...
          </>
        ) : (
          'Update Product'
        )}
      </Button>
    </form>
  );
};

export default ProductEditForm;