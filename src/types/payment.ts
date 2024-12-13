import type { Currency } from './product';

export type PaymentMethod = 'cash' | 'bank';
export type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'failed';

export interface PaymentDetails {
  listingId: string;
  duration: number;
  amount: number;
  currency: Currency;
  referenceNumber: string;
}

export interface Invoice {
  id: string;
  productId: string;
  amount: number;
  currency: Currency;
  dueDate: string;
  status: PaymentStatus;
  listingDuration: number;
  paymentMethod?: PaymentMethod;
}