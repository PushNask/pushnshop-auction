import type { Product, ProductImage, Currency } from '@/types/product';

export interface ProductEditFormProps {
  initialProduct?: Partial<Product>;
  onSave?: (product: Product) => void;
}

export interface FormState extends Partial<Product> {
  images: ProductImage[];
  currency: Currency;
  status: 'pending' | 'active' | 'draft' | 'expired';
}