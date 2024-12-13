import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AnalyticsData, AnalyticsStats } from '@/types/analytics';
import { useToast } from '@/components/ui/use-toast';

export const useAnalytics = (timeframe: '7d' | '30d' | '90d') => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        
        // Get analytics data from Supabase
        const { data: analyticsData, error } = await supabase
          .from('analytics')
          .select(`
            listing_id,
            views,
            whatsapp_clicks,
            created_at
          `)
          .gte('created_at', new Date(Date.now() - parseInt(timeframe) * 86400000).toISOString());

        if (error) throw error;

        // Transform data for charts
        const transformedData: AnalyticsData[] = Array.from({ length: parseInt(timeframe) }, (_, i) => {
          const date = new Date(Date.now() - (parseInt(timeframe) - 1 - i) * 86400000);
          const dayData = analyticsData.filter(d => 
            new Date(d.created_at).toDateString() === date.toDateString()
          );
          
          return {
            date: date.toLocaleDateString(),
            views: dayData.reduce((sum, d) => sum + (d.views || 0), 0),
            clicks: dayData.reduce((sum, d) => sum + (d.whatsapp_clicks || 0), 0),
            inquiries: Math.floor(Math.random() * 10) // Mock data for inquiries
          };
        });

        setData(transformedData);

        // Calculate stats
        const totalViews = analyticsData.reduce((sum, d) => sum + (d.views || 0), 0);
        const totalClicks = analyticsData.reduce((sum, d) => sum + (d.whatsapp_clicks || 0), 0);

        setStats({
          totalViews,
          totalClicks,
          activeListings: 12, // This should come from products table
          avgResponseTime: '2.5 hours',
          conversionRate: `${((totalClicks / totalViews) * 100).toFixed(1)}%`,
          totalInquiries: 89
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load analytics data"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe, toast]);

  return { data, stats, isLoading };
};