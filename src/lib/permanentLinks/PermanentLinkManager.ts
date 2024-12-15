import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type PermanentLink = Database['public']['Tables']['permanent_links']['Row'];

export class PermanentLinkManager {
  private static TOTAL_LINKS = 120;
  
  static async initialize() {
    try {
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn('User not authenticated, skipping permanent links initialization');
        return;
      }

      const { data: existingLinks, error: countError } = await supabase
        .from('permanent_links')
        .select('*');
    
      if (countError) {
        console.error('Error checking existing links:', countError);
        return;
      }
    
      if (!existingLinks || existingLinks.length === 0) {
        const links = Array.from({ length: this.TOTAL_LINKS }, (_, i) => ({
          url_path: `/p/${i + 1}`,
          url_key: `p${i + 1}`,
          status: 'available' as const
        }));
      
        const { error: insertError } = await supabase
          .from('permanent_links')
          .insert(links);
          
        if (insertError) {
          console.error('Error creating permanent links:', insertError);
        }
      }
    } catch (error) {
      console.error('Error initializing permanent links:', error);
    }
  }

  static async assignLink(productId: string): Promise<string | null> {
    // Find available link
    const { data: availableLink, error: findError } = await supabase
      .from('permanent_links')
      .select('*')
      .eq('status', 'available')
      .order('last_assigned_at', { ascending: true })
      .limit(1)
      .single();

    if (findError) {
      console.error('Error finding available link:', findError);
      return null;
    }

    if (!availableLink) {
      // Find oldest assigned link
      const { data: oldestLink, error: oldestError } = await supabase
        .from('permanent_links')
        .select('*')
        .eq('status', 'active')
        .order('last_assigned_at', { ascending: true })
        .limit(1)
        .single();

      if (oldestError || !oldestLink) {
        console.error('Error finding oldest link:', oldestError);
        return null;
      }

      // Update the oldest link
      const { error: updateError } = await supabase
        .from('permanent_links')
        .update({
          current_listing_id: productId,
          last_assigned_at: new Date().toISOString(),
          status: 'active'
        })
        .eq('id', oldestLink.id);

      if (updateError) {
        console.error('Error updating oldest link:', updateError);
        return null;
      }

      return oldestLink.url_key;
    }

    // Assign the available link
    const { error: assignError } = await supabase
      .from('permanent_links')
      .update({
        current_listing_id: productId,
        status: 'active',
        last_assigned_at: new Date().toISOString()
      })
      .eq('id', availableLink.id);

    if (assignError) {
      console.error('Error assigning link:', assignError);
      return null;
    }

    return availableLink.url_key;
  }

  static async releaseLink(productId: string) {
    const { error } = await supabase
      .from('permanent_links')
      .update({
        current_listing_id: null,
        status: 'available'
      })
      .eq('current_listing_id', productId);

    if (error) {
      console.error('Error releasing link:', error);
    }
  }

  static async getProductByLink(urlKey: string) {
    const { data: link, error: linkError } = await supabase
      .from('permanent_links')
      .select('current_listing_id')
      .eq('url_key', urlKey)
      .single();

    if (linkError || !link?.current_listing_id) {
      return null;
    }

    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select(`
        *,
        products (
          *,
          product_images (
            *
          ),
          users!products_seller_id_fkey (
            whatsapp_number
          )
        )
      `)
      .eq('id', link.current_listing_id)
      .single();

    if (listingError || !listing) {
      console.error('Error fetching product:', listingError);
      return null;
    }

    return listing;
  }

  static async getNextAvailableLink() {
    const { data: link, error } = await supabase
      .from('permanent_links')
      .select('*')
      .eq('status', 'available')
      .order('performance_score', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return link;
  }

  static async recycleExpiredLinks() {
    const { error } = await supabase
      .from('permanent_links')
      .update({
        status: 'available',
        current_listing_id: null,
        last_assigned_at: null
      })
      .eq('status', 'active')
      .lt('last_assigned_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;
  }

  static async recycleLink(linkId: number) {
    const { error } = await supabase
      .from('permanent_links')
      .update({
        status: 'available',
        current_listing_id: null,
        last_assigned_at: null,
        rotation_count: supabase.rpc('increment_rotation_count', { link_id: linkId })
      })
      .eq('id', linkId);

    if (error) throw error;
  }
}
