import { supabase } from '@/integrations/supabase/client';
import type { ManagedProduct } from '@/types/product-management';
import type { Currency } from '@/types/product';

interface ProductAnalytics {
  views: number;
  whatsapp_clicks: number;
  created_at?: string;
  updated_at?: string;
  id?: string;
  listing_id?: string;
}

interface DbProductResponse {
  id: string;
  title: string;
  price: number;
  currency: Currency;
  quantity: number;
  status: string;
  listings: Array<{
    status: string;
    end_time: string | null;
  }>;
  analytics: ProductAnalytics[];
}

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

  return (data as DbProductResponse[]).map(product => {
    const analytics = product.analytics?.[0] || { views: 0, whatsapp_clicks: 0 };
    
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency as Currency,
      quantity: product.quantity,
      status: product.status === 'active' ? 'active' : 
             product.status === 'pending' ? 'pending' : 'expired',
      expiresAt: product.listings?.[0]?.end_time || null,
      views: analytics.views || 0,
      whatsappClicks: analytics.whatsapp_clicks || 0
    };
  });
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