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
      seller:users!products_seller_id_fkey (id)
    `)
    .eq('status', 'active')
    .throwOnError();

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
      seller:users!products_seller_id_fkey (
        full_name
      )
    `)
    .eq('status', 'pending')
    .throwOnError();

  if (error) throw error;

  return (data || []).map(product => ({
    id: product.id || '',
    title: product.title || '',
    price: product.price || 0,
    currency: (product.currency || 'XAF') as Currency,
    status: product.status || 'pending',
    seller: product.seller?.full_name || 'Unknown'
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
      listing:listings!payments_listing_id_fkey (
        product:products (
          seller:users!products_seller_id_fkey (
            full_name
          )
        )
      )
    `)
    .eq('status', 'pending')
    .throwOnError();

  if (error) throw error;

  return (data || []).map(payment => ({
    id: payment.id || '',
    amount: payment.amount || 0,
    currency: (payment.currency || 'XAF') as Currency,
    reference: payment.reference_number || '',
    seller: payment.listing?.product?.seller?.full_name || 'Unknown',
    method: (payment.payment_method || 'cash') as PaymentMethod,
    status: (payment.status || 'pending') as PaymentStatus
  }));
};

export const approveProduct = async (productId: string) => {
  const { error } = await supabase
    .from('products')
    .update({ status: 'active' })
    .eq('id', productId)
    .throwOnError();

  if (error) throw error;
};

export const rejectProduct = async (productId: string) => {
  const { error } = await supabase
    .from('products')
    .update({ status: 'rejected' })
    .eq('id', productId)
    .throwOnError();

  if (error) throw error;
};

export const verifyPayment = async (paymentId: string) => {
  const { error } = await supabase
    .from('payments')
    .update({ status: 'completed' })
    .eq('id', paymentId)
    .throwOnError();

  if (error) throw error;
};