import { supabase } from '@/integrations/supabase/client';
import type { AdminStats, PendingProduct, PendingPayment } from '@/types/admin';
import type { Currency } from '@/types/product';

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      price,
      seller_id,
      status,
      payment_status
    `);

  if (error) throw error;

  const stats = {
    totalProducts: data.length,
    activeSellers: new Set(data.map(p => p.seller_id)).size,
    totalRevenue: data.reduce((sum, p) => 
      sum + (p.payment_status === 'verified' ? p.price : 0), 0
    ),
    currency: 'XAF' as Currency
  };

  return stats;
};

export const fetchPendingProducts = async (): Promise<PendingProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      price,
      currency,
      status,
      seller_id,
      users!seller_id (
        email
      )
    `)
    .eq('status', 'pending_approval');

  if (error) throw error;

  return data.map(product => ({
    id: product.id,
    title: product.title,
    seller: product.users?.email || 'Unknown',
    price: product.price,
    currency: product.currency as Currency,
    status: product.status
  }));
};

export const approveProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ status: 'active' })
    .eq('id', productId);

  if (error) throw error;
};

export const rejectProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ status: 'rejected' })
    .eq('id', productId);

  if (error) throw error;
};

export const verifyPayment = async (productId: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ payment_status: 'verified' })
    .eq('id', productId);

  if (error) throw error;
};