import type { Currency } from '@/types/product';

export const LISTING_DURATIONS = {
  '24': { hours: 24, label: '24 hours', prices: { XAF: 5000, USD: 10 } },
  '48': { hours: 48, label: '48 hours', prices: { XAF: 7500, USD: 15 } },
  '72': { hours: 72, label: '72 hours', prices: { XAF: 10000, USD: 20 } },
  '96': { hours: 96, label: '96 hours', prices: { XAF: 12500, USD: 25 } },
  '120': { hours: 120, label: '120 hours', prices: { XAF: 15000, USD: 30 } },
} as const;

export const IMAGE_CONFIG = {
  MAX_IMAGES: 7,
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  THUMBNAIL_SIZE: { width: 400, height: 400 },
} as const;

export const THEME = {
  colors: {
    primary: '#0077B6',
    secondary: '#FB8500',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#F9FAFB',
  },
} as const;