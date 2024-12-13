import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { withQueryTracking } from '@/lib/monitoring/middleware';

const fetchPermanentLinks = async () => {
  return withQueryTracking(
    supabase
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
      .order('created_at', { ascending: false }),
    'fetchPermanentLinks'
  );
};

const PermanentLinks = () => {
  const { data, error, isLoading } = useQuery(['permanentLinks'], fetchPermanentLinks);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading permanent links</div>;

  return (
    <div>
      <h1>Permanent Links</h1>
      <ul>
        {data.map(link => (
          <li key={link.id}>
            <h2>{link.title}</h2>
            <p>{link.description}</p>
            <p>{link.price} {link.currency}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermanentLinks;
