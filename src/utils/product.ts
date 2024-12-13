import type { Product } from '@/types/product';
import type { Database } from '@/integrations/supabase/types';

type DbProduct = Database['public']['Tables']['products']['Row'];

export const mapDbProductToProduct = (dbProduct: DbProduct): Product => {
  return {
    id: dbProduct.id,
    permanentLinkId: undefined, // This will be set by the listing if available
    title: dbProduct.title,
    description: dbProduct.description,
    price: Number(dbProduct.price), // Convert from numeric to number
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

export const formatCurrency = (amount: number, currency: string): string => {
  if (currency === 'XAF') {
    return `${amount.toLocaleString()} XAF`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const getTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h left`;

  const days = Math.floor(hours / 24);
  return `${days}d left`;
};