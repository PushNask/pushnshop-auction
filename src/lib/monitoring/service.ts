import * as Sentry from '@sentry/browser';
import { logger } from './logger';

export class MonitoringService {
  private static instance: MonitoringService;

  private constructor() {
    if (process.env.VITE_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.VITE_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
      });
    }
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  logError(error: Error, context?: Record<string, any>) {
    logger.error({ error, ...context });
    Sentry.captureException(error, { extra: context });
  }

  logInfo(message: string, data?: Record<string, any>) {
    logger.info({ message, ...data });
  }

  startTransaction(name: string) {
    return Sentry.startTransaction({ name });
  }

  trackTiming(name: string, duration: number) {
    logger.info({ name, duration_ms: duration });
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${name} took ${duration}ms`,
      level: 'info',
    });
  }
}