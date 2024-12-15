import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadProductImage } from '@/lib/storage';
import type { Product, ProductImage, Currency } from '@/types/product';

interface ProductEditFormProps {
  initialProduct?: Partial<Product>;
  onSave?: (product: Product) => void;
}

export const ProductEditForm = ({ initialProduct, onSave }: ProductEditFormProps) => {
  const { toast } = useToast();
  const [product, setProduct] = useState<Partial<Product>>({
    images: [],
    currency: 'XAF',
    ...initialProduct
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ProductImage[] = files.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      alt: file.name,
      order_number: (product.images?.length || 0) + index + 1,
      file
    }));

    setProduct(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
  };

  const handleCurrencyChange = (currency: Currency) => {
    setProduct(prev => ({ ...prev, currency }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload images first
      const uploadPromises = product.images
        ?.filter(img => img.file)
        .map(img => uploadProductImage(img.file as File));
      
      const uploadedUrls = await Promise.all(uploadPromises || []);
      
      // Update product with new image URLs
      const updatedImages = product.images?.map((img, index) => ({
        ...img,
        url: img.file ? uploadedUrls[index] : img.url
      }));

      const finalProduct = {
        ...product,
        images: updatedImages
      } as Product;

      onSave?.(finalProduct);
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={product.title || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={product.price || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              value={product.currency}
              onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
              className="w-full p-2 border rounded"
            >
              <option value="XAF">XAF</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <Label htmlFor="images">Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-1"
            />
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {product.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="mt-6">
          Save Product
        </Button>
      </Card>
    </form>
  );
};