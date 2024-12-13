import { supabase } from '@/integrations/supabase/client';

export class FileStorage {
  private static readonly MAX_SIZE = 2 * 1024 * 1024; // 2MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  static async uploadProductImage(productId: string, file: File): Promise<string> {
    // Validate file
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type');
    }

    if (file.size > this.MAX_SIZE) {
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

    const { data: { publicUrl } } = supabase
      .storage
      .from('product-images')
      .getPublicUrl(filename);

    return publicUrl;
  }

  static async deleteProductImages(productId: string): Promise<void> {
    const { data, error } = await supabase
      .storage
      .from('product-images')
      .list(productId);

    if (error) throw error;

    if (data.length > 0) {
      const filesToRemove = data.map(file => `${productId}/${file.name}`);
      const { error: deleteError } = await supabase
        .storage
        .from('product-images')
        .remove(filesToRemove);

      if (deleteError) throw deleteError;
    }
  }
}

export const uploadProductImage = FileStorage.uploadProductImage.bind(FileStorage);