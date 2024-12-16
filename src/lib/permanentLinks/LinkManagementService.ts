import { supabase } from '@/integrations/supabase/client';
import type { PermanentLink } from '@/types/permanent-links';

export class LinkManagementService {
  private static instance: LinkManagementService;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): LinkManagementService {
    if (!LinkManagementService.instance) {
      LinkManagementService.instance = new LinkManagementService();
    }
    return LinkManagementService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await this.checkExistingLinks();
      this.initialized = true;
      console.log('LinkManagementService initialized successfully');
    } catch (error) {
      console.error('Error initializing permanent links:', error);
      throw error;
    }
  }

  private async checkExistingLinks(): Promise<void> {
    const { data: existingLinks, error } = await supabase
      .from('permanent_links')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Failed to check existing links: ${error.message}`);
    }

    if (!existingLinks || existingLinks.length === 0) {
      await this.createInitialLinks();
    }
  }

  private async createInitialLinks(): Promise<void> {
    const linksToCreate = Array.from({ length: 120 }, (_, i) => ({
      url_path: `p${i + 1}`,
      url_key: `p${i + 1}`,
      status: 'available' as const,
      rotation_count: 0,
      performance_score: 0
    }));

    const { error } = await supabase
      .from('permanent_links')
      .insert(linksToCreate);

    if (error) {
      throw new Error(`Failed to create initial links: ${error.message}`);
    }
  }

  public async getAvailableLink(): Promise<PermanentLink | null> {
    const { data: link, error } = await supabase
      .from('permanent_links')
      .select('*')
      .eq('status', 'available')
      .order('rotation_count', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error('Error getting available link:', error);
      return null;
    }

    return link;
  }

  public async assignLinkToListing(linkId: number, listingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('permanent_links')
      .update({
        current_listing_id: listingId,
        status: 'active',
        last_assigned_at: new Date().toISOString()
      })
      .eq('id', linkId);

    if (error) {
      console.error('Error assigning link to listing:', error);
      return false;
    }

    await this.incrementRotationCount(linkId);
    return true;
  }

  private async incrementRotationCount(linkId: number): Promise<void> {
    const { error } = await supabase.rpc('increment_rotation_count', {
      link_id: linkId
    });

    if (error) {
      console.error('Error incrementing rotation count:', error);
    }
  }
}