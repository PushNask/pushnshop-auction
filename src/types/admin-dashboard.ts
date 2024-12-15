export interface SystemStatus {
  responseTime: number;
  errorRate: number;
}

export interface OverviewMetrics {
  totalUsers: number;
  usersTrend: number;
  activeListings: number;
  listingsTrend: number;
  totalRevenue: number;
  revenueTrend: number;
  systemHealth: string;
  systemStatus: SystemStatus;
}

export interface UserMetrics {
  growth: Array<{ date: string; count: number }>;
  demographics: Array<{ role: string; count: number }>;
}

export interface ProductMetrics {
  categories: Array<{ status: string; count: number }>;
}

export interface AdminDashboardMetrics {
  overview: OverviewMetrics;
  userMetrics: UserMetrics;
  productMetrics: ProductMetrics;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  response_time: number;
  error_rate: number;
  active_users: number;
}