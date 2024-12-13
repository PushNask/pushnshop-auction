import type { ProductImage } from './product';

export interface FormData {
  title: string;
  description: string;
  price: string;
  currency: 'XAF' | 'USD';
  quantity: number;
  category: string;
  duration: '24' | '48' | '72' | '96' | '120';
  condition?: 'new' | 'used';
}

export type { ProductImage };