import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const PermanentLinks = () => {
  const { data: links, error, isLoading } = useQuery({
    queryKey: ['permanentLinks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_links')
        .select(`
          *,
          current_listing:listings!permanent_links_current_listing_id_fkey (
            id,
            product:products (
              title,
              description,
              price,
              currency,
              seller:users!products_seller_id_fkey (
                full_name
              )
            )
          )
        `)
        .order('id', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load permanent links'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Permanent Links</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links?.map((link) => (
          <Card key={link.id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">/{link.url_key}</h2>
                <p className="text-sm text-muted-foreground">Status: {link.status}</p>
                {link.current_listing?.product && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="font-medium">{link.current_listing.product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {link.current_listing.product.seller?.full_name || 'Unknown Seller'}
                    </p>
                    <p className="text-sm">
                      {link.current_listing.product.currency} {link.current_listing.product.price}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PermanentLinks;