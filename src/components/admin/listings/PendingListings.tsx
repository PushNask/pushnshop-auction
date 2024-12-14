import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { Badge } from "@/components/ui/badge";

export function PendingListings() {
  const { toast } = useToast();

  const { data: pendingListings, isLoading, refetch } = useQuery({
    queryKey: ['pending-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          products (
            title,
            description,
            price,
            currency,
            seller_id
          )
        `)
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleApprove = async (listingId: string) => {
    const { error } = await supabase
      .from('listings')
      .update({ status: 'active' })
      .eq('id', listingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve listing",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Listing approved successfully",
    });
    refetch();
  };

  const handleReject = async (listingId: string) => {
    const { error } = await supabase
      .from('listings')
      .update({ status: 'rejected' })
      .eq('id', listingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject listing",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Listing rejected successfully",
    });
    refetch();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pending Listings</h2>
      {pendingListings?.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No pending listings</p>
          </CardContent>
        </Card>
      ) : (
        pendingListings?.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <CardTitle>{listing.products.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{listing.products.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Price:</p>
                  <Badge>
                    {listing.products.price} {listing.products.currency}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleApprove(listing.id)}>
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={() => handleReject(listing.id)}>
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default PendingListings;