import { supabase } from '@/integrations/supabase/client';
import type { PermanentLink } from '@/types/permanent-links';

export class BaseLinkManager {
  protected static TOTAL_LINKS = 120;
  
  protected static async checkExistingLinks() {
    const { data: existingLinks, error: countError } = await supabase
      .from('permanent_links')
      .select('*');
    
    if (countError) {
      console.error('Error checking existing links:', countError);
      return null;
    }
    
    return existingLinks;
  }

  protected static async createInitialLinks() {
    try {
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
    } catch (error) {
      console.error('Error creating initial links:', error);
    }
  }
}