import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Users, Eye, MessageSquare } from 'lucide-react';
import { StatCard } from './StatCard';
import { PerformanceChart } from './PerformanceChart';
import { MetricsChart } from './MetricsChart';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTranslation } from 'react-i18next';

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');
  const { data, stats, isLoading } = useAnalytics(timeframe);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title={t('analytics.stats.views')}
          value={stats.totalViews}
          icon={Eye}
          trend={12.5}
        />
        <StatCard
          title={t('analytics.stats.clicks')}
          value={stats.totalClicks}
          icon={MessageSquare}
          trend={8.2}
        />
        <StatCard
          title={t('analytics.stats.listings')}
          value={stats.activeListings}
          icon={TrendingUp}
          trend={-2.1}
        />
      </div>

      <PerformanceChart data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsChart
          title={t('analytics.charts.responseTime')}
          data={data}
          dataKey="inquiries"
          color="#0077B6"
        />
        <MetricsChart
          title={t('analytics.charts.demographics')}
          data={data}
          dataKey="views"
          color="#FB8500"
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;