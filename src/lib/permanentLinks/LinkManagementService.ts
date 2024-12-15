import { supabase } from '@/integrations/supabase/client';
import { BaseLinkManager } from './BaseLinkManager';

export class LinkManagementService extends BaseLinkManager {
  static async initialize() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn('User not authenticated, skipping permanent links initialization');
        return;
      }

      const existingLinks = await this.checkExistingLinks();
    
      if (!existingLinks || existingLinks.length === 0) {
        await this.createInitialLinks();
      }
    } catch (error) {
      console.error('Error initializing permanent links:', error);
    }
  }

  static async releaseLink(productId: string) {
    try {
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
    } catch (error) {
      console.error('Error in releaseLink:', error);
    }
  }

  static async recycleExpiredLinks() {
    try {
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
    } catch (error) {
      console.error('Error recycling expired links:', error);
    }
  }

  static async recycleLink(linkId: number) {
    try {
      const { error } = await supabase
        .from('permanent_links')
        .update({
          status: 'available',
          current_listing_id: null,
          last_assigned_at: null
        })
        .eq('id', linkId);

      if (error) throw error;

      await supabase.rpc('increment_rotation_count', { link_id: linkId });
    } catch (error) {
      console.error('Error recycling link:', error);
    }
  }
}