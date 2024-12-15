import { supabase } from '@/integrations/supabase/client';
import { BaseLinkManager } from './BaseLinkManager';

export class LinkAssignmentManager extends BaseLinkManager {
  static async assignLink(productId: string): Promise<string | null> {
    try {
      // Find available link
      const { data: availableLink, error: findError } = await supabase
        .from('permanent_links')
        .select('*')
        .eq('status', 'available')
        .order('last_assigned_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (findError) {
        console.error('Error finding available link:', findError);
        return null;
      }

      if (!availableLink) {
        return this.reassignOldestLink(productId);
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
    } catch (error) {
      console.error('Error in assignLink:', error);
      return null;
    }
  }

  private static async reassignOldestLink(productId: string): Promise<string | null> {
    try {
      const { data: oldestLink, error: oldestError } = await supabase
        .from('permanent_links')
        .select('*')
        .eq('status', 'active')
        .order('last_assigned_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (oldestError || !oldestLink) {
        console.error('Error finding oldest link:', oldestError);
        return null;
      }

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
    } catch (error) {
      console.error('Error in reassignOldestLink:', error);
      return null;
    }
  }
}