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
  type: 'error' | 'warning';
  message: string;
  timestamp: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'high' | 'medium' | 'low';
}

export interface AnalyticsData {
  date: string;
  views: number;
  clicks: number;
  inquiries: number;
}

export interface AnalyticsMetrics {
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  trends: {
    viewsTrend: number;
    clicksTrend: number;
    conversionTrend: number;
    revenueTrend: number;
  };
  data: AnalyticsData[];
}