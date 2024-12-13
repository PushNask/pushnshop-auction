import { supabase } from '@/integrations/supabase/client';
import type { AdminStats, PendingProduct, PendingPayment } from '@/types/admin';
import type { Currency } from '@/types/product';

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

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
      *,
      users!inner (
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

export const fetchPendingPayments = async (): Promise<PendingPayment[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      users!inner (
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
    seller: product.users?.email || 'Unknown',
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