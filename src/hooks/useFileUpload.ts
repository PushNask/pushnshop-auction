import { useState } from 'react';
import { fileStorage } from '@/lib/storage';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File, productId: string) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const url = await fileStorage.uploadProductImage(file, productId);
      return url;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
}