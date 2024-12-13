import { supabase } from '@/integrations/supabase/client';
import type { AdminStats, PendingProduct, PendingPayment } from '@/types/admin';
import type { Currency } from '@/types/product';

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const { data, error } = await supabase
    .from('admin_stats')
    .select('*')
    .single();

  if (error) throw error;

  return {
    totalProducts: data.total_products,
    activeSellers: data.active_sellers,
    totalRevenue: data.total_revenue,
    currency: data.currency as Currency
  };
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
      seller:seller_id (
        id,
        email
      )
    `)
    .eq('status', 'pending_approval');

  if (error) throw error;

  return data.map(product => ({
    id: product.id,
    title: product.title,
    seller: product.seller?.email || 'Unknown',
    price: product.price,
    currency: product.currency as Currency,
    status: product.status
  }));
};

export const fetchPendingPayments = async (): Promise<PendingPayment[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      price,
      currency,
      payment_status,
      seller_id,
      seller:seller_id (
        id,
        email
      )
    `)
    .eq('payment_status', 'pending');

  if (error) throw error;

  return data.map(product => ({
    id: product.id,
    reference: `PAY-${product.id.slice(0, 8)}`,
    amount: product.price,
    currency: product.currency as Currency,
    seller: product.seller?.email || 'Unknown',
    method: 'bank',
    status: 'pending'
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