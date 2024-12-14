import { MetricCard } from "./MetricCard";
import type { OverviewMetrics } from "@/types/admin-dashboard";

interface StatsOverviewProps {
  metrics?: OverviewMetrics;
  isLoading: boolean;
}

export function StatsOverview({ metrics, isLoading }: StatsOverviewProps) {
  if (isLoading || !metrics) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Users"
        value={metrics.totalUsers}
        trend={metrics.usersTrend}
        icon="users"
      />
      <MetricCard
        title="Active Listings"
        value={metrics.activeListings}
        trend={metrics.listingsTrend}
        icon="shopping-bag"
      />
      <MetricCard
        title="Total Revenue"
        value={metrics.totalRevenue}
        trend={metrics.revenueTrend}
        format="currency"
        icon="dollar-sign"
      />
      <MetricCard
        title="System Health"
        value={metrics.systemHealth}
        icon="activity"
        status={`Response Time: ${metrics.systemStatus.responseTime.toFixed(0)}ms`}
      />
    </div>
  );
}