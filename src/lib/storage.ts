import { supabase } from '@/integrations/supabase/client';

export const uploadProductImage = async (productId: string, file: File): Promise<string> => {
  // Validate file
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Invalid file type');
  }

  if (file.size > 2 * 1024 * 1024) { // 2MB
    throw new Error('File too large');
  }

  // Generate unique filename
  const extension = file.name.split('.').pop();
  const filename = `${productId}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase
    .storage
    .from('product-images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('product-images')
    .getPublicUrl(filename);

  return publicUrl;
};