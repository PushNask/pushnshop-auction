import { MonitoringService } from './service';

export const withPerformanceMonitoring = (handler: Function) => async (...args: any[]) => {
  const start = performance.now();
  const monitoring = MonitoringService.getInstance();

  try {
    return await handler(...args);
  } catch (error) {
    monitoring.logError(error as Error, {
      handler: handler.name,
      args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg),
    });
    throw error;
  } finally {
    const duration = performance.now() - start;
    monitoring.trackTiming(`Handler: ${handler.name}`, duration);
  }
};

export const withQueryTracking = async <T>(
  query: Promise<T>,
  queryName: string
): Promise<T> => {
  const start = performance.now();
  const monitoring = MonitoringService.getInstance();

  try {
    const result = await query;
    const duration = performance.now() - start;
    monitoring.trackTiming(`DB Query: ${queryName}`, duration);
    return result;
  } catch (error) {
    monitoring.logError(error as Error, { queryName });
    throw error;
  }
};