import { supabase } from '@/integrations/supabase/client';
import { withQueryTracking } from '@/lib/monitoring/middleware';
import type { AdminStats, PendingProduct, PendingPayment } from '@/types/admin';

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      price,
      currency,
      seller:seller_id(id)
    `)
    .eq('status', 'active');

  if (error) throw error;

  const stats: AdminStats = {
    totalProducts: data.length,
    activeSellers: new Set(data.map(p => p.seller?.id)).size,
    totalRevenue: data.reduce((sum, p) => sum + (p.price || 0), 0),
    currency: 'XAF'
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
      seller:seller_id(full_name)
    `)
    .eq('status', 'pending');

  if (error) throw error;

  return data.map(p => ({
    id: p.id,
    title: p.title,
    price: p.price,
    currency: p.currency,
    seller: p.seller?.full_name || 'Unknown'
  }));
};

export const fetchPendingPayments = async (): Promise<PendingPayment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      currency,
      reference_number,
      listing:listing_id(
        product:product_id(
          seller:seller_id(full_name)
        )
      )
    `)
    .eq('status', 'pending');

  if (error) throw error;

  return data.map(p => ({
    id: p.id,
    amount: p.amount,
    currency: p.currency,
    reference: p.reference_number,
    seller: p.listing?.product?.seller?.full_name || 'Unknown'
  }));
};

export const approveProduct = async (productId: string) => {
  const { error } = await supabase
    .from('products')
    .update({ status: 'active' })
    .eq('id', productId);

  if (error) throw error;
};

export const rejectProduct = async (productId: string) => {
  const { error } = await supabase
    .from('products')
    .update({ status: 'rejected' })
    .eq('id', productId);

  if (error) throw error;
};

export const verifyPayment = async (paymentId: string) => {
  const { error } = await supabase
    .from('payments')
    .update({ status: 'completed' })
    .eq('id', paymentId);

  if (error) throw error;
};