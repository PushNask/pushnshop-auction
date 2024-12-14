import { MonitoringService } from './MonitoringService';

export function setupErrorTracking() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', async (event) => {
    await MonitoringService.logError(event.error, {
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  });

  window.addEventListener('unhandledrejection', async (event) => {
    await MonitoringService.logError(event.reason, {
      type: 'unhandledrejection',
      url: window.location.href
    });
  });
}