export * from './BuildMonitor';
export * from './BuildVerification';
export * from './types';

// Initialize build monitoring with default config
import { BuildMonitor } from './BuildMonitor';
const buildMonitor = BuildMonitor.getInstance({
  environment: 'development',
  verbose: true,
  errorReporting: true,
  metrics: true
});

// Export a convenience function for logging build errors
export const logBuildError = (error: Error, metadata?: Record<string, any>) => {
  buildMonitor.logBuildError({
    type: 'runtime',
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    metadata
  });
};