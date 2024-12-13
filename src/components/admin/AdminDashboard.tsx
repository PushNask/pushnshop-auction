import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  BarChart3,
  Users,
  ShoppingBag,
  ArrowUp,
} from 'lucide-react';
import type { AdminStats, PendingProduct, PendingPayment } from '@/types/admin';
import { 
  fetchAdminStats, 
  fetchPendingProducts, 
  fetchPendingPayments,
  approveProduct,
  rejectProduct,
  verifyPayment
} from '@/services/admin';
import { formatCurrency } from '@/utils/currency';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);

  const loadData = async () => {
    try {
      const [statsData, productsData, paymentsData] = await Promise.all([
        fetchAdminStats(),
        fetchPendingProducts(),
        fetchPendingPayments()
      ]);
      
      setStats(statsData);
      setPendingProducts(productsData);
      setPendingPayments(paymentsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (productId: string) => {
    setIsLoading(true);
    try {
      await approveProduct(productId);
      setPendingProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Success",
        description: "Product approved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve product",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleReject = async (productId: string) => {
    setIsLoading(true);
    try {
      await rejectProduct(productId);
      setPendingProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Success",
        description: "Product rejected successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject product",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleVerifyPayment = async (paymentId: string) => {
    setIsLoading(true);
    try {
      await verifyPayment(paymentId);
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
      toast({
        title: "Success",
        description: "Payment verified successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify payment",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalProducts}</h3>
                <div className="flex items-center mt-2 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm ml-1">Active</span>
                </div>
              </div>
              <div className="p-4 bg-gray-100 rounded-full">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Sellers</p>
                <h3 className="text-2xl font-bold mt-2">{stats.activeSellers}</h3>
                <div className="flex items-center mt-2 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm ml-1">Active</span>
                </div>
              </div>
              <div className="p-4 bg-gray-100 rounded-full">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-2">
                  {formatCurrency(stats.totalRevenue, stats.currency)}
                </h3>
                <div className="flex items-center mt-2 text-green-500">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm ml-1">Growing</span>
                </div>
              </div>
              <div className="p-4 bg-gray-100 rounded-full">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Pending Products</TabsTrigger>
          <TabsTrigger value="payments">Payment Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {pendingProducts.map(product => (
            <Card key={product.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-500">Seller: {product.seller}</p>
                    <p className="text-sm">
                      {formatCurrency(product.price, product.currency)}
                    </p>
                  </div>
                  <Badge className="bg-yellow-500">Pending</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(product.id)}
                    disabled={isLoading}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(product.id)}
                    disabled={isLoading}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {pendingPayments.map(payment => (
            <Card key={payment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Reference: {payment.reference}</h3>
                    <p className="text-sm text-gray-500">Seller: {payment.seller}</p>
                    <p className="text-sm">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                  </div>
                  <Badge className="bg-yellow-500">Pending</Badge>
                </div>
                <Button
                  onClick={() => handleVerifyPayment(payment.id)}
                  disabled={isLoading}
                  className="w-full bg-[#0077B6] hover:bg-[#0077B6]/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verify Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;