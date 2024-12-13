import type { Currency } from '@/types/product';
import { IMAGE_CONFIG } from '@/config/constants';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AcceptedImageType = typeof ACCEPTED_TYPES[number];

export const validateImage = (file: File): string | null => {
  if (!ACCEPTED_TYPES.includes(file.type as AcceptedImageType)) {
    return 'Invalid file type. Please upload JPEG, PNG, or WebP images.';
  }
  if (file.size > IMAGE_CONFIG.MAX_SIZE) {
    return 'File too large. Maximum size is 2MB.';
  }
  return null;
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  if (currency === 'XAF') {
    return `XAF ${amount.toLocaleString()}`;
  }
  return `$${amount.toFixed(2)}`;
};

export const getTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};
