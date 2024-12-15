import type { Product } from '@/types/product';

export const mapDbProductToProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    description: dbProduct.description,
    price: Number(dbProduct.price),
    currency: dbProduct.currency,
    quantity: dbProduct.quantity,
    images: dbProduct.product_images?.map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || '',
      order_number: img.order_number
    })) || [],
    status: dbProduct.status,
    sellerId: dbProduct.seller_id,
    sellerWhatsApp: dbProduct.seller_whatsapp,
    createdAt: dbProduct.created_at,
    expiresAt: dbProduct.end_time,
    viewCount: 0
  };
};