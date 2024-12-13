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

export type ProductStatus = 'active' | 'sold' | 'ended' | 'pending';

export type Filters = {
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
};

export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc';