import { MetricCard } from "./MetricCard";
import type { AdminDashboardMetrics } from "@/types/admin-dashboard";

interface StatsOverviewProps {
  metrics?: AdminDashboardMetrics;
  isLoading: boolean;
}

export function StatsOverview({ metrics, isLoading }: StatsOverviewProps) {
  if (isLoading || !metrics?.overview) {
    return <div>Loading metrics...</div>;
  }

  const { overview } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Users"
        value={overview.totalUsers}
        trend={overview.usersTrend}
        icon="users"
      />
      <MetricCard
        title="Active Listings"
        value={overview.activeListings}
        trend={overview.listingsTrend}
        icon="shopping-bag"
      />
      <MetricCard
        title="Total Revenue"
        value={overview.totalRevenue}
        trend={overview.revenueTrend}
        format="currency"
        icon="dollar-sign"
      />
      <MetricCard
        title="System Health"
        value={overview.systemHealth}
        icon="activity"
        status={overview.systemStatus ? `Response Time: ${overview.systemStatus.responseTime.toFixed(0)}ms` : undefined}
      />
    </div>
  );
}