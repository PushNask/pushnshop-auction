import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { withQueryTracking } from '@/lib/monitoring/middleware';

const fetchPermanentLinks = async () => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      products (
        id,
        title,
        description,
        price,
        currency
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const PermanentLinks = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['permanentLinks'],
    queryFn: fetchPermanentLinks
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading permanent links</div>;

  return (
    <div>
      <h1>Permanent Links</h1>
      <ul>
        {data?.map(link => (
          <li key={link.id}>
            <h2>{link.products?.title}</h2>
            <p>{link.products?.description}</p>
            <p>{link.products?.price} {link.products?.currency}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermanentLinks;