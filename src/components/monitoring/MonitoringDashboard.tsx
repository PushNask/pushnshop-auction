import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  BarChart3,
  Activity,
  Users,
  Timer
} from 'lucide-react';
import { useMetrics } from '@/hooks/useMetrics';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { PerformanceChart } from './PerformanceChart';

const MonitoringDashboard = () => {
  const { metrics, isLoading, error } = useMetrics();
  const { isAuthorized, isChecking } = useAuthCheck();

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
          You are not authorized to view this dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  if (error || !metrics) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error?.message || 'Failed to load metrics'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">System Monitoring</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
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
              Active Listings
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
              Response Time
            </CardTitle>
            <Timer className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(metrics.averageResponseTime)}ms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Error Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.errorRate.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="errors">
        <TabsList>
          <TabsTrigger value="errors">Recent Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="errors">
          <Card>
            <CardContent className="p-4 space-y-4">
              {metrics.recentErrors.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No recent errors to display
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