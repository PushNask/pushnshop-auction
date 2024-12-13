import { useState } from 'react';
import { FileStorage } from '@/lib/storage';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File, productId: string) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const url = await FileStorage.uploadProductImage(productId, file);
      return url;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, progress, error };
}