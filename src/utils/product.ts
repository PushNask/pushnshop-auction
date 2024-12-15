import type { Product, ProductImage, ProductStatus, DbProduct } from '@/types/product';

export const DEFAULT_PRODUCT: Product = {
  id: '',
  title: '',
  description: '',
  price: 0,
  currency: 'XAF',
  images: [],
  status: 'draft',
  quantity: 1,
  viewCount: 0,
  permanentLinkId: ''
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

export const mapDbProductToProduct = (dbProduct: DbProduct): Product => {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    description: dbProduct.description,
    price: Number(dbProduct.price),
    currency: dbProduct.currency || 'XAF',
    quantity: dbProduct.quantity,
    status: dbProduct.status as ProductStatus,
    images: (dbProduct.product_images || []).map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt || '',
      order_number: img.order_number,
      product_id: img.product_id,
      created_at: img.created_at
    })),
    viewCount: 0,
    sellerId: dbProduct.seller_id,
    sellerWhatsApp: dbProduct.seller?.whatsapp_number || '',
    createdAt: dbProduct.created_at,
    expiresAt: dbProduct.end_time,
    paymentStatus: dbProduct.payment_status
  };
};