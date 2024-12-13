export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
};

export type ProductStatus = 'active' | 'sold' | 'ended' | 'pending';

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
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  inStock?: boolean;
  endingSoon?: boolean;
};

export type SortOption = 'newest' | 'ending-soon' | 'price-low' | 'price-high';