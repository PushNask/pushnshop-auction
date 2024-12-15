import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { Product } from '@/types/product';
import { mapDbProductToProduct } from '@/utils/product';

export const ProductApproval = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          users!products_seller_id_fkey (
            whatsapp_number,
            full_name
          )
        `)
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProducts = (data || []).map(dbProduct => mapDbProductToProduct(dbProduct));
      setPendingProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching pending products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch pending products"
      });
    }
  };

  const handleApproval = async (productId: string, approved: boolean) => {
    setIsLoading(true);
    try {
      const newStatus = approved ? 'active' : 'rejected';
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Create notification for seller
      const product = pendingProducts.find(p => p.id === productId);
      if (product?.sellerId) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: product.sellerId,
            type: 'product_status',
            title: `Product ${approved ? 'Approved' : 'Rejected'}`,
            message: `Your product listing has been ${approved ? 'approved' : 'rejected'}.`
          });

        if (notificationError) throw notificationError;
      }

      toast({
        title: 'Success',
        description: `Product ${approved ? 'approved' : 'rejected'} successfully`,
      });

      // Refresh the pending products list
      fetchPendingProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Product Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingProducts.length === 0 ? (
          <p className="text-muted-foreground">No pending products to approve</p>
        ) : (
          <div className="space-y-4">
            {pendingProducts.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="mt-2">
                      <p className="text-sm">Price: {product.currency} {product.price}</p>
                      <p className="text-sm">Quantity: {product.quantity}</p>
                      {product.sellerWhatsApp && (
                        <p className="text-sm">WhatsApp: {product.sellerWhatsApp}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproval(product.id, true)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="ml-2">Approve</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproval(product.id, false)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="ml-2">Reject</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};