import type { Currency } from './product';

export interface ManagedProduct {
  id: string;
  title: string;
  price: number;
  currency: Currency;
  status: 'active' | 'pending' | 'expired';
  quantity: number;
  expiresAt?: string | null;
  views: number;
  whatsappClicks: number;
  image?: string;
}

export interface ProductStats {
  totalViews: number;
  totalClicks: number;
  activeListings: number;
}

export interface ProductCardProps {
  product: ManagedProduct;
  onEdit: (product: ManagedProduct) => void;
  onDelete: (product: ManagedProduct) => void;
  onRenew?: (product: ManagedProduct) => void;
}