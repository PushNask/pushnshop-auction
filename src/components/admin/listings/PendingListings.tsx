import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export function PendingListings() {
  const { toast } = useToast();

  const { data: pendingListings, isLoading, refetch } = useQuery({
    queryKey: ['pending-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            url,
            alt
          ),
          users!products_seller_id_fkey (
            full_name,
            whatsapp_number
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleApprove = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'active' })
        .eq('id', productId);

      if (error) throw error;

      // Create notification for seller
      const product = pendingListings?.find(p => p.id === productId);
      if (product?.seller_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: product.seller_id,
            type: 'product_status',
            title: 'Product Approved',
            message: 'Your product listing has been approved.'
          });
      }

      toast({
        title: "Success",
        description: "Product approved successfully",
      });
      refetch();
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve product"
      });
    }
  };

  const handleReject = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'rejected' })
        .eq('id', productId);

      if (error) throw error;

      // Create notification for seller
      const product = pendingListings?.find(p => p.id === productId);
      if (product?.seller_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: product.seller_id,
            type: 'product_status',
            title: 'Product Rejected',
            message: 'Your product listing has been rejected.'
          });
      }

      toast({
        title: "Success",
        description: "Product rejected successfully",
      });
      refetch();
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject product"
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pending Listings</h2>
      </div>

      {!pendingListings?.length ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No pending listings</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingListings.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{product.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      by {product.users?.full_name || 'Unknown Seller'}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {product.currency} {product.price.toLocaleString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">{product.description}</p>
                  {product.users?.whatsapp_number && (
                    <p className="text-sm text-muted-foreground">
                      WhatsApp: {product.users.whatsapp_number}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(product.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(product.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingListings;