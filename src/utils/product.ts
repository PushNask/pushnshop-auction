import type { Product, ProductImage } from '@/types/product';

export const DEFAULT_PRODUCT: Product = {
  id: '',
  title: '',
  description: '',
  price: 0,
  currency: 'XAF',
  images: [],
  status: 'draft',
  quantity: 1,
  sellerId: '',
  createdAt: new Date().toISOString(),
};

export const validateProduct = (product: Partial<Product>): string[] => {
  const errors: string[] = [];

  if (!product.title?.trim()) {
    errors.push('Title is required');
  }

  if (!product.description?.trim()) {
    errors.push('Description is required');
  }

  if (!product.price || product.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!product.quantity || product.quantity < 1) {
    errors.push('Quantity must be at least 1');
  }

  return errors;
};

export const formatProductImages = (images: ProductImage[]): ProductImage[] => {
  return images.map((image, index) => ({
    ...image,
    order_number: index,
  }));
};