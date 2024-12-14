import { supabase } from '@/integrations/supabase/client';
import type { PermanentLink } from '@/types/permanent-links';

export class EnhancedPermanentLinkManager {
  private transformLinkData(data: any): PermanentLink {
    return {
      id: data.id,
      url_key: data.url_key,
      url_path: data.url_path,
      status: data.status || 'available',
      current_listing_id: data.current_listing_id,
      created_at: data.created_at || new Date().toISOString(),
      last_assigned_at: data.last_assigned_at || new Date().toISOString(),
      performance_score: data.performance_score || 0,
      rotation_count: data.rotation_count || 0
    };
  }

  public async createPermanentLink(linkData: Omit<PermanentLink, 'id'>) {
    const { data, error } = await supabase
      .from('permanent_links')
      .insert(linkData)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.transformLinkData(data);
  }

  public async updatePermanentLink(linkId: number, linkData: Partial<PermanentLink>) {
    const { data, error } = await supabase
      .from('permanent_links')
      .update(linkData)
      .eq('id', linkId)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.transformLinkData(data);
  }

  public async getPermanentLink(linkId: number): Promise<PermanentLink> {
    const { data, error } = await supabase
      .from('permanent_links')
      .select('*')
      .eq('id', linkId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.transformLinkData(data);
  }

  public async deletePermanentLink(linkId: number) {
    const { error } = await supabase
      .from('permanent_links')
      .delete()
      .eq('id', linkId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
