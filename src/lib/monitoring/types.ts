export interface SystemMetrics {
  response_time: number;
  error_rate: number;
  active_users: number;
  memory_usage: number;
  cpu_usage: number;
  database_connections: number;
}

export interface Alert {
  metric: keyof SystemMetrics;
  value: number;
  threshold: number;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface AlertConfig {
  metric: keyof SystemMetrics;
  threshold: number;
  condition: 'above' | 'below';
  severity: 'high' | 'medium' | 'low';
}

export interface BuildError {
  type: 'runtime' | 'compile' | 'lint' | 'promise' | 'other';
  message: string;
  stack?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BuildMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  errorCount: number;
  warningCount: number;
}

export interface BuildConfig {
  environment: 'development' | 'staging' | 'production';
  verbose: boolean;
  errorReporting: boolean;
  metrics: boolean;
}