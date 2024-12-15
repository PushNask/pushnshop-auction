import { useAnalytics } from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/loading/LoadingOverlay";

const AnalyticsDashboard = () => {
  const { metrics, isLoading, error } = useAnalytics();

  if (error) {
    return <div>Error loading analytics: {error.message}</div>;
  }

  return (
    <LoadingOverlay loading={isLoading}>
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">Analytics Overview</h2>
          <p>Total Views: {metrics.views}</p>
          <p>Total Clicks: {metrics.clicks}</p>
          <p>Total Conversions: {metrics.conversions}</p>
          <p>Total Revenue: {metrics.revenue}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Trends</h2>
          <p>Views Trend: {metrics.trends.viewsTrend}</p>
          <p>Clicks Trend: {metrics.trends.clicksTrend}</p>
          <p>Conversion Trend: {metrics.trends.conversionTrend}</p>
          <p>Revenue Trend: {metrics.trends.revenueTrend}</p>
        </Card>
      </div>
    </LoadingOverlay>
  );
};

export default AnalyticsDashboard;
