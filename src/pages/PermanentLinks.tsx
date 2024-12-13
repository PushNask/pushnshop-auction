import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

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
            product:products!inner (
              title,
              end_time
            )
          )
        `);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading permanent links</div>;

  return (
    <div>
      {links?.map((link) => (
        <div key={link.id}>
          <h3>{link.listings?.product?.title}</h3>
          <p>URL: {link.url_path}</p>
          <p>Expires: {link.listings?.product?.end_time}</p>
        </div>
      ))}
    </div>
  );
};

export default PermanentLinks;