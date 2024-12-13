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
  currency: 'XAF' | 'USD';
  quantity: number;
  images: ProductImage[];
}