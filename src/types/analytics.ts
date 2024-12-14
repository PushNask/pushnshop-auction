export interface AnalyticsMetrics {
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  timeRange: string;
  trends: {
    viewsTrend: number;
    clicksTrend: number;
    conversionTrend: number;
    revenueTrend: number;
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

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}