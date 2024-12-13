import * as Sentry from '@sentry/browser';
import { logger } from './logger';

export class MonitoringService {
  private static instance: MonitoringService;

  private constructor() {
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
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

  trackTiming(name: string, duration: number) {
    logger.info({ name, duration_ms: duration });
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${name} took ${duration}ms`,
      level: 'info',
    });
  }
}