import { logger } from './logger';
import type { BuildError, BuildMetrics, BuildConfig } from './types';

// Define DOM types for browser environment
interface CustomWindow {
  addEventListener(
    type: string,
    listener: (event: any) => void,
    options?: { capture?: boolean; once?: boolean; passive?: boolean }
  ): void;
}

declare const window: CustomWindow | undefined;

export class BuildMonitor {
  private static instance: BuildMonitor;
  private config: BuildConfig;
  private metrics: BuildMetrics = {
    startTime: Date.now(),
    endTime: 0,
    duration: 0,
    success: true,
    errorCount: 0,
    warningCount: 0
  };

  private constructor(config: BuildConfig = {
    environment: 'development',
    verbose: true,
    errorReporting: true,
    metrics: true
  }) {
    this.config = config;
    this.setupErrorHandlers();
  }

  public static getInstance(config?: BuildConfig): BuildMonitor {
    if (!BuildMonitor.instance) {
      BuildMonitor.instance = new BuildMonitor(config);
    }
    return BuildMonitor.instance;
  }

  private setupErrorHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event: any) => {
        const errorEvent = event as { 
          error?: { message: string; stack?: string } 
        };
        
        this.logBuildError({
          type: 'runtime',
          message: errorEvent.error?.message || 'Unknown error',
          stack: errorEvent.error?.stack,
          timestamp: new Date().toISOString()
        });
      });

      window.addEventListener('unhandledrejection', (event: any) => {
        const promiseEvent = event as { 
          reason?: { message: string; stack?: string } 
        };
        
        this.logBuildError({
          type: 'promise',
          message: promiseEvent.reason?.message || 'Unhandled Promise rejection',
          stack: promiseEvent.reason?.stack,
          timestamp: new Date().toISOString()
        });
      });
    }
  }

  public startBuild(): void {
    this.metrics.startTime = Date.now();
    this.metrics.success = true;
    this.metrics.errorCount = 0;
    this.metrics.warningCount = 0;
    logger.info('Build started');
  }

  public endBuild(success: boolean): void {
    this.metrics.endTime = Date.now();
    this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
    this.metrics.success = success;
    
    logger.info('Build completed', {
      success,
      duration: this.metrics.duration,
      errorCount: this.metrics.errorCount
    });
  }

  public logBuildError(error: BuildError): void {
    this.metrics.errorCount++;
    this.metrics.success = false;
    
    if (this.config.errorReporting) {
      logger.error('Build Error:', {
        type: error.type,
        message: error.message,
        stack: error.stack,
        timestamp: error.timestamp
      });
    }
  }

  public getMetrics(): BuildMetrics {
    this.metrics.endTime = Date.now();
    this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
    return { ...this.metrics };
  }
}