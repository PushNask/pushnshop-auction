import { IMAGE_CONFIG } from '@/config/constants';

export const validateImage = (file: File): string | null => {
  if (!IMAGE_CONFIG.ACCEPTED_TYPES.includes(file.type as "image/jpeg" | "image/png" | "image/webp")) {
    return 'Invalid file type. Please upload JPEG, PNG, or WebP images.';
  }
  if (file.size > IMAGE_CONFIG.MAX_SIZE) {
    return 'File too large. Maximum size is 2MB.';
  }
  return null;
};