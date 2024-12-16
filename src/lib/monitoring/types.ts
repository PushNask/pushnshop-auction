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