import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Link as LinkIcon } from "lucide-react";

interface PermanentLink {
  id: number;
  url_key: string;
  url_path: string;
  status: 'active' | 'available';
  current_listing_id: string | null;
  rotation_count: number;
  performance_score: number;
  last_assigned_at: string | null;
}

export function LinkManagement() {
  const { toast } = useToast();

  const { data: links, isLoading, refetch } = useQuery({
    queryKey: ['permanent-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_links')
        .select(`
          *,
          listings!permanent_links_current_listing_id_fkey (
            id,
            products (
              title,
              seller:users!products_seller_id_fkey (
                full_name
              )
            )
          )
        `)
        .order('id', { ascending: true });

      if (error) throw error;
      return data as PermanentLink[];
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
                    <p className="font-medium">{link.performance_score.toFixed(2)}</p>
                  </div>
                </div>
                {link.current_listing_id && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Current Product</p>
                    <p className="font-medium">
                      {(link as any).listings?.products?.title || 'Unknown Product'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      by {(link as any).listings?.products?.seller?.full_name || 'Unknown Seller'}
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