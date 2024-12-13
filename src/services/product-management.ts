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
      listings (
        status,
        end_time
      ),
      analytics (
        views,
        whatsapp_clicks
      )
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
    status: (product.listings?.[0]?.status || 'pending') as 'active' | 'pending' | 'expired',
    expiresAt: product.listings?.[0]?.end_time || null,
    views: product.analytics?.[0]?.views || 0,
    whatsappClicks: product.analytics?.[0]?.whatsapp_clicks || 0
  }));
};

export const updateProductQuantity = async (productId: string, quantity: number): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ quantity })
    .eq('id', productId);

  if (error) throw error;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
};