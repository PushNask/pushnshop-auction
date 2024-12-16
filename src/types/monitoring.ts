export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  response_time: number;
  error_rate: number;
  active_users: number;
}

export interface Alert {
  id: number;
  metric: keyof SystemMetrics;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
  created_at: string;
}

export interface PerformanceMetric {
  created_at: string;
  response_time: number;
  error_rate: number;
  active_users: number;
}

export interface Metrics {
  system: SystemMetrics;
  alerts: Alert[];
  performance: PerformanceMetric[];
}