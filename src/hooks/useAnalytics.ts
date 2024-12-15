import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AnalyticsMetrics } from '@/types/analytics';

export const useAnalytics = (timeRange: string = '7d') => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const startDate = new Date();
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      return transformAnalyticsData(data);
    }
  });

  return { metrics, isLoading, error };
};

const transformAnalyticsData = (data: any[]): AnalyticsMetrics => {
  const views = data.reduce((sum, item) => sum + (item.views || 0), 0);
  const clicks = data.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const conversions = data.reduce((sum, item) => sum + (item.conversions || 0), 0);
  const revenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

  const previousPeriodData = data.slice(0, Math.floor(data.length / 2));
  const currentPeriodData = data.slice(Math.floor(data.length / 2));

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    views,
    clicks,
    conversions,
    revenue,
    trends: {
      viewsTrend: calculateTrend(
        currentPeriodData.reduce((sum, item) => sum + (item.views || 0), 0),
        previousPeriodData.reduce((sum, item) => sum + (item.views || 0), 0)
      ),
      clicksTrend: calculateTrend(
        currentPeriodData.reduce((sum, item) => sum + (item.clicks || 0), 0),
        previousPeriodData.reduce((sum, item) => sum + (item.clicks || 0), 0)
      ),
      conversionTrend: calculateTrend(
        currentPeriodData.reduce((sum, item) => sum + (item.conversions || 0), 0),
        previousPeriodData.reduce((sum, item) => sum + (item.conversions || 0), 0)
      ),
      revenueTrend: calculateTrend(
        currentPeriodData.reduce((sum, item) => sum + (item.revenue || 0), 0),
        previousPeriodData.reduce((sum, item) => sum + (item.revenue || 0), 0)
      )
    },
    data: data.map(item => ({
      date: new Date(item.created_at).toISOString().split('T')[0],
      views: item.views || 0,
      clicks: item.clicks || 0,
      inquiries: item.inquiries || 0
    }))
  };
};