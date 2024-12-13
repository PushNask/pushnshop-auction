import { supabase } from '@/integrations/supabase/client';
import { withQueryTracking } from '@/lib/monitoring/middleware';

export const approveProduct = async (productId: string) => {
  return withQueryTracking(
    supabase
      .from('products')
      .update({ status: 'active' })
      .eq('id', productId),
    'approveProduct'
  );
};

export const rejectProduct = async (productId: string) => {
  return withQueryTracking(
    supabase
      .from('products')
      .update({ status: 'rejected' })
      .eq('id', productId),
    'rejectProduct'
  );
};

export const verifyPayment = async (paymentId: string) => {
  return withQueryTracking(
    supabase
      .from('payments')
      .update({ status: 'verified' })
      .eq('id', paymentId),
    'verifyPayment'
  );
};