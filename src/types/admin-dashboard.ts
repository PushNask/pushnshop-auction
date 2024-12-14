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
  systemHealth: 'Excellent' | 'Good' | 'Warning';
  systemStatus: SystemStatus;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

export interface UserDemographics {
  role: string;
  count: number;
}

export interface UserMetrics {
  growth: UserGrowthData[];
  demographics: UserDemographics[];
}

export interface ProductCategoryData {
  status: string;
  count: number;
}

export interface ProductMetrics {
  categories: ProductCategoryData[];
}

export interface AdminDashboardMetrics {
  overview: OverviewMetrics;
  userMetrics: UserMetrics;
  productMetrics: ProductMetrics;
}