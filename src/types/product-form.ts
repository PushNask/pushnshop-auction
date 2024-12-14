import type { Currency } from './product';

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  currency: Currency;
  category: string;
  images: Array<{
    id: string;
    url: string;
    file?: File;
  }>;
  duration: '24' | '48' | '72' | '96' | '120';
}

export interface ApiResponse<T> {
  data: T | null;
  error: {
    message: string;
  } | null;
}