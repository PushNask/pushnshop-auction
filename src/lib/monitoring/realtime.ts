import { MonitoringService } from './service';

export class RealtimeMonitoring {
  private connectionStart: number;
  private monitoring: MonitoringService;

  constructor() {
    this.monitoring = MonitoringService.getInstance();
    this.connectionStart = performance.now();
  }

  onConnect() {
    const duration = performance.now() - this.connectionStart;
    this.monitoring.trackTiming('Realtime Connection', duration);
  }

  onDisconnect(reason: string) {
    this.monitoring.logInfo('Realtime disconnected', { reason });
  }

  onSubscribe(channel: string) {
    this.monitoring.logInfo('Channel subscribed', { channel });
  }

  onError(error: Error) {
    this.monitoring.logError(error, { context: 'Realtime' });
  }
}