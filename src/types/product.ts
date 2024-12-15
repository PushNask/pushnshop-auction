export type Currency = 'XAF' | 'USD';
export type ListingStatus = 'draft' | 'pending_payment' | 'pending_approval' | 'active' | 'expired' | 'rejected';
export type Duration = '24' | '48' | '72' | '96' | '120';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order_number: number;
  file?: File;
  isNew?: boolean;
  preview?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  quantity: number;
  images: ProductImage[];
  status: ListingStatus;
  sellerId: string;
  sellerWhatsApp?: string;
  createdAt: string;
  expiresAt?: string;
  viewCount: number;
  permanentLinkId?: string;
}