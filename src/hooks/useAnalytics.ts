import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AnalyticsMetrics } from '@/types/analytics';

export const useAnalytics = (timeRange: string = '7d') => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .gte('created_at', new Date(Date.now() - getDurationInMs(timeRange)))
        .order('created_at', { ascending: true });

      if (error) throw error;

      return transformAnalyticsData(data);
    }
  });

  return { metrics, isLoading, error };
};

const getDurationInMs = (timeRange: string): number => {
  const durations: Record<string, number> = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000
  };
  return durations[timeRange] || durations['7d'];
};

const transformAnalyticsData = (data: any[]): AnalyticsMetrics => {
  return {
    views: data.reduce((sum, item) => sum + (item.views || 0), 0),
    clicks: data.reduce((sum, item) => sum + (item.clicks || 0), 0),
    conversions: data.reduce((sum, item) => sum + (item.conversions || 0), 0),
    revenue: data.reduce((sum, item) => sum + (item.revenue || 0), 0),
    metrics: {
      daily: data.map(item => ({
        date: new Date(item.created_at).toISOString().split('T')[0],
        value: item.views || 0
      }))
    }
  };
};