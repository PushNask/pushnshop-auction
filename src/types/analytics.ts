export interface AnalyticsData {
  date: string;
  views: number;
  clicks: number;
  inquiries: number;
}

export interface MetricsChartProps {
  title: string;
  data: AnalyticsData[];
  dataKey: keyof AnalyticsData;
  color: string;
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
  metric?: string;
  value?: number;
  threshold?: number;
  severity?: string;
}