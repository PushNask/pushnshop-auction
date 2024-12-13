import { supabase } from '@/integrations/supabase/client';

interface FileUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export class FileStorage {
  private defaultOptions: FileUploadOptions = {
    maxSizeMB: 2,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  };

  async uploadProductImage(
    file: File,
    productId: string,
    options: FileUploadOptions = {}
  ) {
    const opts = { ...this.defaultOptions, ...options };

    if (!opts.allowedTypes?.includes(file.type)) {
      throw new Error('Invalid file type');
    }

    if (file.size > (opts.maxSizeMB || 2) * 1024 * 1024) {
      throw new Error('File too large');
    }

    const extension = file.name.split('.').pop();
    const filename = `${productId}/${Date.now()}.${extension}`;

    const { data, error } = await supabase
      .storage
      .from('product-images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase
      .storage
      .from('product-images')
      .getPublicUrl(filename);

    return publicUrl;
  }

  async deleteProductImages(productId: string) {
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

export const fileStorage = new FileStorage();