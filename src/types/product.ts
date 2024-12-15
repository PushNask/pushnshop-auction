export type Currency = 'XAF' | 'USD';

export type Duration = '24' | '48' | '72' | '96' | '120';

export type ProductStatus = 'draft' | 'pending' | 'active' | 'expired';

export type ListingStatus = ProductStatus;

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order_number: number;
  product_id?: string;
  created_at?: string;
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
  images: ProductImage[];
  status: ProductStatus;
  viewCount: number;
  quantity: number;
  sellerWhatsApp?: string;
  sellerId?: string;
  permanentLinkId?: string;
  createdAt?: string;
  expiresAt?: string;
  paymentStatus?: string;
}

export interface DbProduct {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  quantity: number;
  status: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
  end_time?: string;
  product_images: {
    id: string;
    url: string;
    alt: string | null;
    order_number: number;
    product_id: string;
    created_at: string;
  }[];
  users?: {
    whatsapp_number: string | null;
  };
}

export interface ProductGalleryProps {
  images: ProductImage[];
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}