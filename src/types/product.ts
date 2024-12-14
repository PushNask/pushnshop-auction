export type Duration = '24' | '48' | '72' | '96' | '120';

export type Currency = 'XAF' | 'USD';

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
  duration: Duration;
  images: ProductImage[];
}

export interface ApiResponse<T> {
  data: T | null;
  error: {
    message: string;
  } | null;
}
