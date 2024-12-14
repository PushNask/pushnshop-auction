import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export class EnhancedPermanentLinkManager {
  private static readonly ROTATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MIN_VISIBILITY_TIME = 6 * 60 * 60 * 1000; // 6 hours

  static async optimizeRotation() {
    try {
      const { data: links, error } = await supabase
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

      if (error) throw error;

      for (const link of links || []) {
        const metrics = await this.calculatePerformanceMetrics(link);
        if (this.shouldRotateLink(metrics)) {
          await this.rotateLink(link.id);
        }
      }
    } catch (error) {
      console.error('Link optimization failed:', error);
      toast({
        title: "Error",
        description: "Failed to optimize link rotation",
        variant: "destructive"
      });
    }
  }

  private static async calculatePerformanceMetrics(link: any) {
    const analytics = link.link_analytics?.[0] || { views: 0, clicks: 0 };
    const timeSinceLastRotation = Date.now() - new Date(link.last_assigned_at).getTime();
    
    const performanceScore = (
      (analytics.views * 1) +
      (analytics.clicks * 2)
    ) / Math.max(1, timeSinceLastRotation / (1000 * 60 * 60)); // Per hour

    return {
      performanceScore,
      timeSinceLastRotation,
      analytics
    };
  }

  private static shouldRotateLink(metrics: any): boolean {
    return metrics.timeSinceLastRotation >= this.MIN_VISIBILITY_TIME && (
      metrics.performanceScore < 0.1 || 
      metrics.timeSinceLastRotation >= this.ROTATION_INTERVAL
    );
  }

  private static async rotateLink(linkId: number) {
    const { data: nextListing } = await supabase
      .from('listings')
      .select('id')
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (nextListing) {
      await supabase.from('permanent_links')
        .update({
          current_listing_id: nextListing.id,
          last_assigned_at: new Date().toISOString(),
          rotation_count: supabase.raw('rotation_count + 1')
        })
        .eq('id', linkId);

      await supabase.from('listings')
        .update({ status: 'active' })
        .eq('id', nextListing.id);
    }
  }

  static async trackAnalytics(linkId: number, event: 'view' | 'click') {
    try {
      const column = `${event}s`;
      await supabase.from('link_analytics')
        .upsert({
          link_id: linkId,
          [column]: supabase.raw(`${column} + 1`),
          last_activity: new Date().toISOString()
        }, {
          onConflict: 'link_id'
        });
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  }
}