export type Currency = 'XAF' | 'USD';

export type ProductStatus = 'draft' | 'pending' | 'active' | 'expired';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order_number: number;
  file?: File;
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
}