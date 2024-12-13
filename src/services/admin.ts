import { supabase } from '@/integrations/supabase/client';
import type { AdminStats, PendingProduct, PendingPayment } from '@/types/admin';
import type { Currency } from '@/types/product';

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) throw error;

  const stats: AdminStats = {
    totalProducts: data.length,
    activeSellers: new Set(data.map(p => p.seller_id)).size,
    totalRevenue: data.reduce((sum, p) => 
      p.payment_status === 'confirmed' ? sum + Number(p.price) : sum, 0
    ),
    currency: 'XAF'
  };

  return stats;
};

export const fetchPendingProducts = async (): Promise<PendingProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      seller:users!inner (
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
      *,
      seller:users!inner (
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