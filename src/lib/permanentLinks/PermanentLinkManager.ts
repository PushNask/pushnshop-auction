import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type PermanentLink = Database['public']['Tables']['permanent_links']['Row'];

export class PermanentLinkManager {
  private static TOTAL_LINKS = 120;
  
  static async initialize() {
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
}