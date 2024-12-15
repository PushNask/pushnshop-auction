export interface AdminDashboardMetrics {
  overview: {
    totalUsers: number;
    usersTrend: number;
    activeListings: number;
    listingsTrend: number;
    totalRevenue: number;
    revenueTrend: number;
    systemHealth: 'Excellent' | 'Good' | 'Warning';
    systemStatus: {
      responseTime: number;
      errorRate: number;
    };
  };
  userMetrics: {
    growth: Array<{
      date: string;
      count: number;
    }>;
    demographics: Array<{
      role: string;
      count: number;
    }>;
  };
  productMetrics: {
    categories: Array<{
      status: string;
      count: number;
    }>;
  };
}