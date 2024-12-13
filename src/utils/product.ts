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
    status: dbProduct.status || 'draft',
    sellerId: dbProduct.seller_id,
    sellerWhatsApp: '', // Will be populated from user data
    createdAt: dbProduct.created_at || new Date().toISOString(),
    expiresAt: dbProduct.end_time || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 0 // Will be populated from analytics
  };
};