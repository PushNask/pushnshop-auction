import { supabase } from '@/integrations/supabase/client';
import type { ManagedProduct } from '@/types/product-management';
import type { Currency, ListingStatus } from '@/types/product';

export const fetchUserProducts = async (userId: string): Promise<ManagedProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      price,
      currency,
      quantity,
      status,
      expires_at,
      view_count,
      whatsapp_clicks
    `)
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(product => ({
    id: product.id,
    title: product.title,
    price: product.price,
    currency: product.currency as Currency,
    quantity: product.quantity,
    status: product.status as ListingStatus,
    expiresAt: product.expires_at,
    views: product.view_count || 0,
    whatsappClicks: product.whatsapp_clicks || 0
  }));
};

export const updateProductQuantity = async (productId: string, quantity: number): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ quantity })
    .eq('id', productId);

  if (error) throw error;
};