import { useState, useEffect } from 'react';
import { AnalyticsMetrics } from '@/types/analytics';
import { supabase } from '@/integrations/supabase/client';

export function useAnalytics(timeRange: '24h' | '7d' | '30d' | '90d') {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_admin_dashboard_metrics', { time_range: timeRange });
        
        if (error) throw error;
        
        if (data) {
          const transformedData: AnalyticsMetrics = {
            views: data.overview?.totalViews || 0,
            clicks: data.overview?.totalClicks || 0,
            conversions: data.overview?.conversions || 0,
            revenue: data.overview?.totalRevenue || 0,
            timeRange,
            trends: {
              viewsTrend: data.overview?.viewsTrend || 0,
              clicksTrend: data.overview?.clicksTrend || 0,
              conversionTrend: data.overview?.conversionTrend || 0,
              revenueTrend: data.overview?.revenueTrend || 0
            },
            data: data.timeSeriesData || [] // Assuming the RPC returns timeSeriesData
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