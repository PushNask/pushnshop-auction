import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MetricsChart } from './MetricsChart';
import { StatCard } from './StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/loading/LoadingOverlay';
import { Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AnalyticsDashboard() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const { metrics, loading } = useAnalytics(timeRange);

  return (
    <LoadingOverlay loading={loading}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('analytics.title')}</h1>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('7d')}
            >
              {t('analytics.timeframes.7d')}
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('30d')}
            >
              {t('analytics.timeframes.30d')}
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('90d')}
            >
              {t('analytics.timeframes.90d')}
            </Button>
          </div>
        </div>

        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Views"
                value={metrics.views}
                trend={metrics.trends.viewsTrend}
                icon={Users}
              />
              <StatCard
                title="Total Clicks"
                value={metrics.clicks}
                trend={metrics.trends.clicksTrend}
                icon={ShoppingBag}
              />
              <StatCard
                title="Conversions"
                value={metrics.conversions}
                trend={metrics.trends.conversionTrend}
                icon={Activity}
              />
              <StatCard
                title="Revenue"
                value={metrics.revenue}
                trend={metrics.trends.revenueTrend}
                icon={DollarSign}
                format="currency"
              />
            </div>

            <Card className="p-6">
              <MetricsChart data={metrics.data} />
            </Card>
          </>
        )}
      </div>
    </LoadingOverlay>
  );
}

export default AnalyticsDashboard;