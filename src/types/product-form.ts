import type { Currency } from './product';

export interface ProductImage {
  id: string;
  url: string;
  isNew?: boolean;
  file?: File;
}

export interface ProductFormData {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  quantity: number;
  images: ProductImage[];
}