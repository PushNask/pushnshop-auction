import { logger } from './logger';
import type { BuildError, BuildMetrics, BuildConfig } from './types';

export class BuildMonitor {
  private static instance: BuildMonitor;
  private errors: BuildError[] = [];
  private metrics: BuildMetrics = {
    startTime: 0,
    endTime: 0,
    duration: 0,
    success: false,
    errorCount: 0,
    warningCount: 0
  };

  private constructor() {
    // Only set up error handlers in browser environment
    if (typeof window !== 'undefined') {
      this.setupErrorHandlers();
    }
  }

  static getInstance(): BuildMonitor {
    if (!BuildMonitor.instance) {
      BuildMonitor.instance = new BuildMonitor();
    }
    return BuildMonitor.instance;
  }

  private setupErrorHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event: Event) => {
        const errorEvent = event as ErrorEvent;
        this.logBuildError({
          type: 'runtime',
          message: errorEvent.error?.message || 'Unknown error',
          stack: errorEvent.error?.stack,
          timestamp: new Date().toISOString()
        });
      });

      window.addEventListener('unhandledrejection', (event: Event) => {
        const promiseEvent = event as PromiseRejectionEvent;
        this.logBuildError({
          type: 'promise',
          message: promiseEvent.reason?.message || 'Unhandled Promise rejection',
          stack: promiseEvent.reason?.stack,
          timestamp: new Date().toISOString()
        });
      });
    }
  }

  startBuild() {
    this.metrics.startTime = performance.now();
    this.metrics.success = false;
    this.errors = [];
    logger.info('Build started');
  }

  endBuild(success: boolean) {
    this.metrics.endTime = performance.now();
    this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
    this.metrics.success = success;
    
    logger.info('Build completed', {
      success,
      duration: this.metrics.duration,
      errors: this.errors.length
    });

    if (this.errors.length > 0) {
      this.generateErrorReport();
    }
  }

  logBuildError(error: BuildError) {
    this.errors.push(error);
    this.metrics.errorCount++;
    
    logger.error('Build error:', {
      error,
      buildMetrics: this.metrics
    });
  }

  private generateErrorReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      errors: this.errors,
      suggestions: this.generateSuggestions()
    };

    logger.info('Build error report generated', report);
    return report;
  }

  private generateSuggestions(): string[] {
    const suggestions: string[] = [];
    
    this.errors.forEach(error => {
      if (error.message.includes('TypeScript')) {
        suggestions.push('Check for type mismatches in your components');
      }
      if (error.message.includes('import')) {
        suggestions.push('Verify all import paths are correct');
      }
      if (error.message.includes('undefined')) {
        suggestions.push('Check for undefined variables or properties');
      }
    });

    return [...new Set(suggestions)]; // Remove duplicates
  }

  getMetrics(): BuildMetrics {
    return { ...this.metrics };
  }

  getErrors(): BuildError[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    this.metrics.errorCount = 0;
  }
}