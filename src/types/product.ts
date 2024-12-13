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
  status: 'active' | 'sold' | 'ended' | 'pending';
  sellerId: string;
  sellerWhatsApp: string;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
};