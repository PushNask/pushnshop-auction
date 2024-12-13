export enum ProductStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  ENDED = 'ended',
  PENDING = 'pending'
}

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
};

export type Product = {
  id: string;
  permanentLinkId: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: ProductImage[];
  status: ProductStatus;
  sellerId: string;
  sellerWhatsApp: string;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
};

export type Filters = {
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  endingSoon: boolean;
};

export type SortOption = 'newest' | 'ending-soon' | 'price-low' | 'price-high';

export const THEME = {
  colors: {
    primary: '#0077B6',
    secondary: '#FB8500',
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    }
  }
} as const;