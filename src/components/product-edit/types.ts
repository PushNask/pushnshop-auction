import type { Product, ProductImage } from '@/types/product';

export interface ProductEditFormProps {
  initialProduct?: Partial<Product>;
  onSave?: (product: Product) => void;
}

export interface FormState extends Partial<Product> {
  images: ProductImage[];
  currency: 'XAF' | 'USD';
  status: 'pending' | 'active' | 'draft' | 'expired';
}