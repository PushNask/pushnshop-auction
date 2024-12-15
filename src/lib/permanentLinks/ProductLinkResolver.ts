import { supabase } from '@/integrations/supabase/client';
import { BaseLinkManager } from './BaseLinkManager';

export class ProductLinkResolver extends BaseLinkManager {
  static async getProductByLink(urlKey: string) {
    try {
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
    } catch (error) {
      console.error('Error in getProductByLink:', error);
      return null;
    }
  }

  static async getNextAvailableLink() {
    try {
      const { data: link, error } = await supabase
        .from('permanent_links')
        .select('*')
        .eq('status', 'available')
        .order('performance_score', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return link;
    } catch (error) {
      console.error('Error getting next available link:', error);
      return null;
    }
  }
}