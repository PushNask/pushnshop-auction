import type { Currency } from './product';
import type { PaymentMethod, PaymentStatus } from './payment';

export interface AdminStats {
  totalProducts: number;
  activeSellers: number;
  totalRevenue: number;
  currency: Currency;
}

export interface PendingProduct {
  id: string;
  title: string;
  seller: string;
  price: number;
  currency: Currency;
  status: string;
}

export interface PendingPayment {
  id: string;
  reference: string;
  amount: number;
  currency: Currency;
  seller: string;
  method: PaymentMethod;
  status: PaymentStatus;
}