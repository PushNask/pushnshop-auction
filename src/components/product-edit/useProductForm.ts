import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadProductImage } from '@/lib/storage';
import type { Product, ProductImage } from '@/types/product';
import type { FormState } from './types';

export const useProductForm = (
  initialProduct?: Partial<Product>,
  onSave?: (product: Product) => void
) => {
  const { toast } = useToast();
  const [product, setProduct] = useState<FormState>({
    images: [],
    currency: 'XAF',
    status: 'pending',
    ...initialProduct
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (images: ProductImage[]) => {
    setProduct(prev => ({ ...prev, images }));
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

      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Insert the product
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: product.title,
          description: product.description,
          price: product.price,
          currency: product.currency,
          quantity: product.quantity,
          seller_id: user.id,
          status: 'pending',
          promotion_range: product.promotionRange || 'local'
        })
        .select()
        .single();

      if (error) throw error;

      // Insert product images
      if (updatedImages && updatedImages.length > 0) {
        const { error: imageError } = await supabase
          .from('product_images')
          .insert(
            updatedImages.map((img, index) => ({
              product_id: data.id,
              url: img.url,
              alt: img.alt || product.title,
              order_number: index + 1
            }))
          );

        if (imageError) throw imageError;
      }

      // Create notification for admin
      await supabase
        .from('notifications')
        .insert({
          type: 'product_pending',
          title: 'New Product Pending Review',
          message: `New product "${product.title}" requires approval`,
          user_id: user.id
        });

      // Convert database response to Product type
      const productResponse: Product = {
        ...data,
        images: updatedImages || [],
        viewCount: 0,
        status: 'pending',
        sellerWhatsApp: user.user_metadata?.whatsapp_number || '',
        sellerId: user.id
      };

      onSave?.(productResponse);
      
      toast({
        title: "Success",
        description: "Product submitted for approval",
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

  return {
    product,
    handleInputChange,
    handleImageChange,
    handleSubmit
  };
};