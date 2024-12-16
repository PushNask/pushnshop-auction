export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  response_time: number;
  error_rate: number;
  active_users: number;
  memory_usage: number;
  cpu_usage: number;
  database_connections: number;
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

export interface AlertConfig {
  metric: keyof SystemMetrics;
  threshold: number;
  condition: 'above' | 'below';
  severity: 'high' | 'medium' | 'low';
}

export interface Alert {
  metric: keyof SystemMetrics;
  value: number;
  threshold: number;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
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
