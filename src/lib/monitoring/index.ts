export * from './BuildMonitor';
export * from './BuildVerification';
export * from './types';

// Initialize build monitoring
import { BuildMonitor } from './BuildMonitor';
const buildMonitor = BuildMonitor.getInstance();

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