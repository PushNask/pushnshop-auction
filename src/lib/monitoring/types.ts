export interface SystemMetrics {
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  memoryUsage: number;
  cpuUsage: number;
  databaseConnections: number;
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