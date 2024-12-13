import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import type { PaymentStatus } from "@/types/payment";

export const PaymentVerification = () => {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: payments, isLoading, refetch } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          currency,
          payment_method,
          reference_number,
          listings (
            products (
              title,
              seller_id
            )
          )
        `)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    }
  });

  const handleVerify = async (paymentId: string) => {
    setProcessingId(paymentId);
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'completed' as PaymentStatus })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment verified successfully",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify payment",
      });
    }
    setProcessingId(null);
  };

  if (isLoading) {
    return <div>Loading payments...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Pending Payments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.reference_number}</TableCell>
              <TableCell>
                {payment.currency} {payment.amount}
              </TableCell>
              <TableCell>{payment.payment_method}</TableCell>
              <TableCell>{payment.listings?.products?.title}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVerify(payment.id)}
                  disabled={processingId === payment.id}
                >
                  {processingId === payment.id ? "Processing..." : "Verify"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};