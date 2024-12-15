export type Currency = 'XAF' | 'USD';

export type Duration = '24' | '48' | '72' | '96' | '120';

export type ListingStatus = 'draft' | 'pending' | 'active' | 'expired';

export type ProductStatus = 'draft' | 'pending' | 'active' | 'expired';

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
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  images: ProductImage[];
  permanentLinkId?: string;
  status?: ProductStatus;
  viewCount?: number;
  quantity?: number;
  sellerId?: string;
  sellerWhatsApp?: string;
  createdAt?: string;
  expiresAt?: string;
}

export interface ProductGalleryProps {
  images: ProductImage[];
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}