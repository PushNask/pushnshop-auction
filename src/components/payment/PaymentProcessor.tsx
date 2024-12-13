import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Currency } from '@/types/product';
import { formatCurrency } from '@/utils/currency';

interface PaymentProcessorProps {
  listingId: string;
  amount: number;
  currency: Currency;
}

export const PaymentProcessor = ({ listingId, amount, currency }: PaymentProcessorProps) => {
  const [status, setStatus] = useState<string>('pending');
  const [error, setError] = useState<string | null>(null);

  const processPayment = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          listing_id: listingId,
          amount,
          currency,
          status: 'processing'
        })
        .select()
        .single();

      if (error) throw error;

      const subscription = supabase
        .channel(`payment-${data.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'payments',
            filter: `id=eq.${data.id}`
          },
          payload => {
            setStatus(payload.new.status);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <p className="text-lg font-semibold">
          {formatCurrency(amount, currency)}
        </p>
        <p className="text-sm text-gray-500">
          Status: {status}
        </p>
      </div>

      <Button
        onClick={processPayment}
        disabled={status !== 'pending'}
        className="w-full"
      >
        {status === 'processing' ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Process Payment'
        )}
      </Button>
    </div>
  );
};