export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  response_time: number;
  error_rate: number;
  active_users: number;
}

export interface AnalyticsMetrics {
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  metrics: {
    daily: Array<{
      date: string;
      value: number;
    }>;
  };
}

export interface SystemAlert {
  id: string;
  type: 'error' | 'warning';
  message: string;
  timestamp: string;
  metric: string;
  value: number;
  threshold: number;
  severity: string;
}