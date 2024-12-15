import type { Currency } from './product';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order_number: number;
  file?: File;
  preview?: string;
}

export interface FormData {
  title: string;
  description: string;
  price: string;
  currency: Currency;
  quantity: string;
  duration: string;
  images: ProductImage[];
}

export interface ApiResponse<T> {
  data: T | null;
  error: {
    message: string;
  } | null;
}