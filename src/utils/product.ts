import type { Product, Currency } from '@/types/product';
import type { Database } from '@/integrations/supabase/types';

type DbProduct = Database['public']['Tables']['products']['Row'];

export const mapDbProductToProduct = (dbProduct: DbProduct): Product => {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    description: dbProduct.description,
    price: Number(dbProduct.price),
    currency: dbProduct.currency || 'XAF',
    quantity: dbProduct.quantity,
    images: [], // Will be populated separately
    status: dbProduct.status as any || 'draft',
    sellerId: dbProduct.seller_id,
    sellerWhatsApp: '', // Will be populated from user data
    createdAt: dbProduct.created_at || new Date().toISOString(),
    expiresAt: dbProduct.end_time || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 0 // Will be populated from analytics
  };
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  if (currency === 'XAF') {
    return `${amount.toLocaleString()} XAF`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};