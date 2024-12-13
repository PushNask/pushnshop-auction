import type { Currency, ListingStatus } from './product';

export interface ManagedProduct {
  id: string;
  title: string;
  price: number;
  currency: Currency;
  quantity: number;
  status: ListingStatus;
  expiresAt: string;
  views: number;
  whatsappClicks: number;
}

export interface UpdateQuantityPayload {
  productId: string;
  quantity: number;
}