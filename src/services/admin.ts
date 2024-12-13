import { supabase } from '@/integrations/supabase/client';
import type { AdminStats, PendingProduct, PendingPayment } from '@/types/admin';
import type { Currency } from '@/types/product';
import type { PaymentMethod, PaymentStatus } from '@/types/payment';

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      price,
      currency,
      seller:users!products_seller_id_fkey(id)
    `)
    .eq('status', 'active');

  if (error) throw error;

  const stats: AdminStats = {
    totalProducts: data?.length || 0,
    activeSellers: new Set(data?.map(p => p.seller?.id) || []).size,
    totalRevenue: data?.reduce((sum, p) => sum + (p.price || 0), 0) || 0,
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
      status,
      seller:users!products_seller_id_fkey(
        full_name
      )
    `)
    .eq('status', 'pending');

  if (error) throw error;

  return (data || []).map(p => ({
    id: p.id,
    title: p.title,
    price: p.price,
    currency: p.currency as Currency,
    status: p.status || 'pending',
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
      status,
      payment_method,
      reference_number,
      listing:listings(
        product:products(
          seller:users!products_seller_id_fkey(
            full_name
          )
        )
      )
    `)
    .eq('status', 'pending');

  if (error) throw error;

  return (data || []).map(p => ({
    id: p.id,
    amount: p.amount,
    currency: p.currency as Currency,
    reference: p.reference_number || '',
    seller: p.listing?.[0]?.product?.seller?.full_name || 'Unknown',
    method: (p.payment_method || 'cash') as PaymentMethod,
    status: (p.status || 'pending') as PaymentStatus
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