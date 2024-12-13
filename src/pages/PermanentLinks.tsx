import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Search, AlertCircle, ArrowRight, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface PermanentLink {
  id: number;
  url: string;
  status: 'available' | 'active';
  product?: {
    title: string;
    expires_at: string;
  } | null;
}

const PermanentLinkSystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['permanent-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_links')
        .select(`
          id,
          url,
          status,
          products (
            title,
            expires_at
          )
        `)
        .order('id');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading links",
          description: error.message
        });
        return [];
      }

      return data.map(link => ({
        ...link,
        product: link.products?.[0] || null
      }));
    }
  });

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const filteredLinks = links.filter(link => 
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
    link.product?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LinkCard = ({ link }: { link: PermanentLink }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="font-mono">{link.url}</span>
            </div>
            {link.product ? (
              <div className="mt-2">
                <p className="font-semibold">{link.product.title}</p>
                <p className="text-sm text-gray-500">
                  Expires in: {getTimeRemaining(link.product.expires_at)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No active product</p>
            )}
          </div>
          <Badge
            variant={link.status === 'active' ? 'default' : 'secondary'}
          >
            {link.status === 'active' ? 'Active' : 'Available'}
          </Badge>
        </div>
        {link.status === 'available' && (
          <Button 
            className="w-full"
            onClick={() => {/* Handle assignment - will be implemented in next phase */}}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Assign Product
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Permanent Links</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <Badge variant="default">
            {links.filter(l => l.status === 'active').length} Active
          </Badge>
          <Badge variant="secondary">
            {links.filter(l => l.status === 'available').length} Available
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6 h-32 animate-pulse bg-gray-100" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLinks.map(link => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>

          {filteredLinks.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No links found matching your search.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default PermanentLinkSystem;