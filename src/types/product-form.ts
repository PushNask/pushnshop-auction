export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order?: number;
  isNew?: boolean;
  file?: File;
  preview?: string;
}

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