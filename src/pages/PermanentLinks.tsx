import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const PermanentLinks = () => {
  const { data: links, isLoading, error } = useQuery({
    queryKey: ['permanent-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_links')
        .select(`
          id,
          url_path,
          current_listing_id,
          listings!inner (
            id,
            product:products!inner (
              title,
              end_time
            )
          )
        `)
        .order('id');

      if (error) {
        throw error;
      }

      return data.map(link => ({
        id: link.id,
        url: link.url_path,
        status: link.current_listing_id ? 'active' : 'available',
        product: link.listings?.product ? {
          title: link.listings.product.title,
          expires_at: link.listings.product.end_time
        } : null
      }));
    }
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching permanent links:', error);
    }
  }, [error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Permanent Links</h1>
      <ul>
        {links.map(link => (
          <li key={link.id}>
            <a href={link.url}>{link.url}</a> - Status: {link.status}
            {link.product && (
              <div>
                <strong>Product:</strong> {link.product.title} - Expires at: {link.product.expires_at}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermanentLinks;
