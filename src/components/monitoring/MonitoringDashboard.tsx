import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  BarChart3,
  Activity,
  Users,
  Timer,
  Loader2
} from 'lucide-react';
import { useMetrics } from '@/hooks/useMetrics';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { PerformanceChart } from './PerformanceChart';
import { useTranslation } from 'react-i18next';

const MonitoringDashboard = () => {
  const { metrics, isLoading, error } = useMetrics();
  const { isAuthorized, isChecking } = useAuthCheck();
  const { t } = useTranslation();

  if (isLoading || isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t('monitoring.unauthorized')}
        </AlertDescription>
      </Alert>
    );
  }

  if (error || !metrics) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error?.message || t('monitoring.loadError')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('monitoring.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('monitoring.activeUsers')}
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('monitoring.activeListings')}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeListings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('monitoring.responseTime')}
            </CardTitle>
            <Timer className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t('monitoring.msValue', { value: Math.round(metrics.averageResponseTime) })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('monitoring.errorRate')}
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t('monitoring.percentValue', { value: metrics.errorRate.toFixed(2) })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="errors">
        <TabsList>
          <TabsTrigger value="errors">{t('monitoring.tabs.errors')}</TabsTrigger>
          <TabsTrigger value="performance">{t('monitoring.tabs.performance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="errors">
          <Card>
            <CardContent className="p-4 space-y-4">
              {metrics.recentErrors.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {t('monitoring.noErrors')}
                </p>
              ) : (
                metrics.recentErrors.map((error) => (
                  <Alert key={error.id} variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error.message}
                      <span className="block text-xs text-gray-500">
                        {new Date(error.timestamp).toLocaleString()}
                      </span>
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardContent className="p-4">
              <PerformanceChart data={metrics.performanceData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;