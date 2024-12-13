import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, AlertCircle, Printer, Download, CheckCircle2, Loader2 } from 'lucide-react';
import type { PaymentDetails, PaymentMethod } from '@/types/payment';
import { useToast } from '@/hooks/use-toast';

interface PaymentHandlerProps {
  onPaymentComplete?: () => void;
}

const PaymentHandler = ({ onPaymentComplete }: PaymentHandlerProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Mock API call - replace with actual payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowReceipt(true);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully."
      });
      onPaymentComplete?.();
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again."
      });
    }
    setIsProcessing(false);
  };

  const Receipt = () => (
    <div className="p-6 space-y-4">
      <div className="text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Payment Received</h3>
        <p className="text-gray-500">Your listing will be reviewed shortly</p>
      </div>

      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span>Amount Paid:</span>
          <span className="font-bold">
            {paymentDetails?.currency === 'XAF' 
              ? `XAF ${paymentDetails?.amount.toLocaleString()}`
              : `$${paymentDetails?.amount.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Reference Number:</span>
          <span className="font-mono">{paymentDetails?.referenceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Method:</span>
          <span>{paymentMethod === 'cash' ? 'Cash Payment' : 'Bank Transfer'}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );

  const BankDetails = () => (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please make the transfer and provide the transaction details below
        </AlertDescription>
      </Alert>

      <div className="border rounded-lg p-4 space-y-2">
        <h4 className="font-semibold">Bank Account Details</h4>
        <div className="space-y-1 text-sm">
          <p>Bank: Example Bank</p>
          <p>Account Name: PushNshop</p>
          <p>Account Number: 1234567890</p>
          <p>Reference: {paymentDetails?.referenceNumber}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Transaction Reference</Label>
          <Input placeholder="Enter bank transaction reference" />
        </div>

        <Button 
          className="w-full bg-[#0077B6] hover:bg-[#0077B6]/90"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Confirm Payment'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={!!paymentDetails} onOpenChange={() => setPaymentDetails(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showReceipt ? 'Payment Receipt' : 'Complete Payment'}
          </DialogTitle>
        </DialogHeader>

        {showReceipt ? (
          <Receipt />
        ) : (
          <Tabs defaultValue="bank" onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Bank Transfer
              </TabsTrigger>
              <TabsTrigger value="cash" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Cash Payment
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bank">
              <BankDetails />
            </TabsContent>
            <TabsContent value="cash">
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Visit our office with this reference number to make the payment
                  </AlertDescription>
                </Alert>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Payment Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>Amount: {paymentDetails?.currency === 'XAF' 
                      ? `XAF ${paymentDetails?.amount.toLocaleString()}`
                      : `$${paymentDetails?.amount.toFixed(2)}`}
                    </p>
                    <p>Reference: {paymentDetails?.referenceNumber}</p>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Details
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentHandler;
