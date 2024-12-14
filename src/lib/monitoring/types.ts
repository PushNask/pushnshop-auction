export interface SystemMetrics {
  response_time: number;
  error_rate: number;
  active_users: number;
  memory_usage: number;
  cpu_usage: number;
  database_connections: number;
}

export interface AlertConfig {
  metric: keyof SystemMetrics;
  threshold: number;
  condition: 'above' | 'below';
  severity: 'low' | 'medium' | 'high';
}

export interface Alert {
  metric: keyof SystemMetrics;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}