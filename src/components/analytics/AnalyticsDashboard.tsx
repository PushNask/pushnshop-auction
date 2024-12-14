import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MetricsChart } from './MetricsChart';
import { PerformanceChart } from './PerformanceChart';
import { StatCard } from './StatCard';
import { Card } from '@/components/ui/card';
import { LoadingOverlay } from '@/components/loading/LoadingOverlay';

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const { metrics, loading, error } = useAnalytics(timeRange);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('analytics.title')}</h1>
        <div className="flex gap-2">
          <Button
            variant={timeframe === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeframe('7d')}
          >
            {t('analytics.timeframes.7d')}
          </Button>
          <Button
            variant={timeframe === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeframe('30d')}
          >
            {t('analytics.timeframes.30d')}
          </Button>
          <Button
            variant={timeframe === '90d' ? 'default' : 'outline'}
            onClick={() => setTimeframe('90d')}
          >
            {t('analytics.timeframes.90d')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value={metrics.views}
          trend={metrics.trends.viewsTrend}
        />
        <StatCard
          title="Total Clicks"
          value={metrics.clicks}
          trend={metrics.trends.clicksTrend}
        />
        <StatCard
          title="Conversions"
          value={metrics.conversions}
          trend={metrics.trends.conversionTrend}
        />
        <StatCard
          title="Revenue"
          value={metrics.revenue}
          trend={metrics.trends.revenueTrend}
          format="currency"
        />
      </div>

      <Card className="p-6">
        <PerformanceChart data={metrics.data} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsChart
          title="Views Over Time"
          data={metrics.data}
          dataKey="views"
          color="#0077B6"
        />
        <MetricsChart
          title="Clicks Over Time"
          data={metrics.data}
          dataKey="clicks"
          color="#FB8500"
        />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
