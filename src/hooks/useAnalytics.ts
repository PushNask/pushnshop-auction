import { useState, useEffect } from 'react';
import { AnalyticsMetrics } from '@/types/analytics';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface RawMetricsResponse {
  overview: {
    totalViews: number;
    totalClicks: number;
    conversions: number;
    totalRevenue: number;
    viewsTrend: number;
    clicksTrend: number;
    conversionTrend: number;
    revenueTrend: number;
  };
  timeSeriesData: Array<{
    date: string;
    views: number;
    clicks: number;
    inquiries: number;
  }>;
}

export function useAnalytics(timeRange: '24h' | '7d' | '30d' | '90d') {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .rpc('get_admin_dashboard_metrics', { time_range: timeRange });
        
        if (fetchError) throw fetchError;
        
        const rawData = data as unknown as RawMetricsResponse;
        
        if (rawData) {
          const transformedData: AnalyticsMetrics = {
            views: rawData.overview.totalViews,
            clicks: rawData.overview.totalClicks,
            conversions: rawData.overview.conversions,
            revenue: rawData.overview.totalRevenue,
            timeRange,
            trends: {
              viewsTrend: rawData.overview.viewsTrend,
              clicksTrend: rawData.overview.clicksTrend,
              conversionTrend: rawData.overview.conversionTrend,
              revenueTrend: rawData.overview.revenueTrend
            },
            data: rawData.timeSeriesData
          };
          setMetrics(transformedData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [timeRange]);

  return { metrics, loading, error };
}