export interface SystemStatus {
  responseTime: number;
  errorRate: number;
}

export interface AdminDashboardMetrics {
  overview: {
    totalUsers: number;
    usersTrend: number;
    activeListings: number;
    listingsTrend: number;
    totalRevenue: number;
    revenueTrend: number;
    systemHealth: string;
    systemStatus: SystemStatus;
  };
  userMetrics: {
    growth: Array<{ date: string; count: number }>;
    demographics: Array<{ role: string; count: number }>;
  };
  productMetrics: {
    categories: Array<{ status: string; count: number }>;
  };
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  response_time: number;
  error_rate: number;
  active_users: number;
}