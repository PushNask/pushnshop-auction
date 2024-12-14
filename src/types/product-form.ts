import type { Currency } from './product';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  file?: File;
  preview?: string;
}

export interface FormData {
  title: string;
  description: string;
  price: string;
  currency: Currency;
  quantity: string;
  duration: '24' | '48' | '72' | '96' | '120';
  images: ProductImage[];
}

export interface ProductFormData extends FormData {
  category?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: {
    message: string;
  } | null;
}