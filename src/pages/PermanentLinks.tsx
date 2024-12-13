import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PermanentLinks = () => {
  const { data: links, isLoading, error } = useQuery({
    queryKey: ['permanent-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_links')
        .select(`
          *,
          listings!inner (
            *,
            products!inner (
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
        product: link.listings?.products ? {
          title: link.listings.products.title,
          expires_at: link.listings.products.end_time
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
        {links?.map(link => (
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