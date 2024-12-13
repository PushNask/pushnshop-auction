export type Currency = 'XAF' | 'USD';
export type PaymentMethod = 'cash' | 'transfer';
export type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'failed';
export type ListingStatus = 'draft' | 'pending_payment' | 'pending_approval' | 'active' | 'inactive' | 'expired';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  isNew?: boolean;
  file?: File;
}

export interface Product {
  id: string;
  permanentLinkId?: number;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  quantity: number;
  images: ProductImage[];
  status: ListingStatus;
  sellerId: string;
  sellerWhatsApp: string;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
}

export interface Filters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  status?: ListingStatus;
}

export interface SortOption {
  field: keyof Product;
  direction: 'asc' | 'desc';
}