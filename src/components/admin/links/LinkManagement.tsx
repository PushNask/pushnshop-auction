import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Link as LinkIcon } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type PermanentLinkRow = Database['public']['Tables']['permanent_links']['Row'];

interface ListingWithProduct {
  id: string;
  product: {
    title: string;
    seller: {
      full_name: string;
    };
  };
}

interface PermanentLink extends PermanentLinkRow {
  current_listing?: ListingWithProduct | null;
}

export function LinkManagement() {
  const { toast } = useToast();

  const { data: links, isLoading, refetch } = useQuery<PermanentLink[]>({
    queryKey: ['permanent-links'],
    queryFn: async () => {
      // First get all permanent links
      const { data: permanentLinks, error: linksError } = await supabase
        .from('permanent_links')
        .select('*')
        .order('id', { ascending: true });

      if (linksError) throw linksError;

      // Then for each link with a current_listing_id, fetch the listing details
      const linksWithListings = await Promise.all(
        permanentLinks.map(async (link) => {
          if (!link.current_listing_id) {
            return { ...link, current_listing: null };
          }

          const { data: listing, error: listingError } = await supabase
            .from('listings')
            .select(`
              id,
              product:products (
                title,
                seller:users (
                  full_name
                )
              )
            `)
            .eq('id', link.current_listing_id)
            .single();

          if (listingError) {
            console.error('Error fetching listing:', listingError);
            return { ...link, current_listing: null };
          }

          return {
            ...link,
            current_listing: listing
          };
        })
      );

      return linksWithListings;
    }
  });

  const handleRecycle = async (linkId: number) => {
    try {
      const { error } = await supabase
        .from('permanent_links')
        .update({
          current_listing_id: null,
          status: 'available'
        })
        .eq('id', linkId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Link recycled successfully"
      });
      refetch();
    } catch (error) {
      console.error('Error recycling link:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to recycle link"
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Permanent Links</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {links?.map((link) => (
          <Card key={link.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  <CardTitle className="text-lg">/{link.url_key}</CardTitle>
                </div>
                <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
                  {link.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Rotation Count</p>
                    <p className="font-medium">{link.rotation_count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Performance Score</p>
                    <p className="font-medium">{link.performance_score?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                {link.current_listing && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Current Product</p>
                    <p className="font-medium">
                      {link.current_listing.product?.title || 'Unknown Product'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      by {link.current_listing.product?.seller?.full_name || 'Unknown Seller'}
                    </p>
                  </div>
                )}
                {link.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecycle(link.id)}
                    className="mt-2"
                  >
                    Recycle Link
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LinkManagement;