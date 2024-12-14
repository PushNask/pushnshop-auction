import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type PermanentLink = Database['public']['Tables']['permanent_links']['Row'];
type LinkAnalytics = Database['public']['Tables']['link_analytics']['Row'];

interface LinkRotationMetrics {
  totalViews: number;
  lastRotation: Date;
  performanceScore: number;
}

export class EnhancedPermanentLinkManager {
  private static readonly ROTATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MIN_VISIBILITY_TIME = 6 * 60 * 60 * 1000; // 6 hours

  static async optimizeRotation() {
    try {
      const { data: links, error: findError } = await supabase
        .from('permanent_links')
        .select(`
          id,
          url_key,
          current_listing_id,
          link_analytics (
            views,
            clicks
          )
        `)
        .order('last_assigned_at', { ascending: true });

      if (findError) {
        console.error('Error finding links:', findError);
        return;
      }

      if (!links) return;

      for (const link of links) {
        const metrics = await this.calculatePerformanceMetrics(link);
        if (this.shouldRotateLink(metrics)) {
          await this.rotateLink(link.id);
        }
      }
    } catch (error) {
      console.error('Link optimization failed:', error);
    }
  }

  private static async calculatePerformanceMetrics(link: PermanentLink & { link_analytics: LinkAnalytics[] }): Promise<LinkRotationMetrics> {
    const analytics = link.link_analytics?.[0] || { views: 0, clicks: 0 };
    const timeSinceLastRotation = Date.now() - new Date(link.last_assigned_at || Date.now()).getTime();
    
    const performanceScore = (
      (analytics.views * 1) +
      (analytics.clicks * 2)
    ) / Math.max(1, timeSinceLastRotation / (1000 * 60 * 60)); // Per hour

    return {
      totalViews: analytics.views,
      lastRotation: new Date(link.last_assigned_at || Date.now()),
      performanceScore
    };
  }

  private static shouldRotateLink(metrics: LinkRotationMetrics): boolean {
    const timeSinceRotation = Date.now() - metrics.lastRotation.getTime();
    
    return timeSinceRotation >= this.MIN_VISIBILITY_TIME && (
      metrics.performanceScore < 0.1 || 
      timeSinceRotation >= this.ROTATION_INTERVAL
    );
  }

  private static async rotateLink(linkId: number) {
    // Find next listing in queue
    const { data: nextListing, error: findError } = await supabase
      .from('listings')
      .select('id')
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (findError) {
      console.error('Error finding next listing:', findError);
      return;
    }

    if (nextListing) {
      // First update the rotation count
      const { error: updateError } = await supabase.rpc('increment_rotation_count', {
        link_id: linkId
      });

      if (updateError) {
        console.error('Failed to update rotation count:', updateError);
        return;
      }

      // Then update the link assignment
      const { error: linkError } = await supabase
        .from('permanent_links')
        .update({
          current_listing_id: nextListing.id,
          last_assigned_at: new Date().toISOString()
        })
        .eq('id', linkId);

      if (linkError) {
        console.error('Error updating link:', linkError);
        return;
      }

      // Update listing status
      const { error: listingError } = await supabase
        .from('listings')
        .update({ status: 'active' })
        .eq('id', nextListing.id);

      if (listingError) {
        console.error('Error updating listing status:', listingError);
      }
    }
  }

  static async trackAnalytics(linkId: number, event: 'view' | 'click') {
    try {
      const { error } = await supabase.rpc('increment_link_analytics', {
        p_link_id: linkId,
        p_column: event + 's'
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  }

  static async getLinkPerformanceMetrics(linkId: number): Promise<LinkAnalytics | null> {
    const { data, error } = await supabase
      .from('link_analytics')
      .select('*')
      .eq('link_id', linkId)
      .single();

    if (error) {
      console.error('Error fetching link metrics:', error);
      return null;
    }

    return data;
  }
}