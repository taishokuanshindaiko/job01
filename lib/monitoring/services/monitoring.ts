import { MonitoringService, LogEntry, PerformanceMetric, SystemMetrics, CustomMetric } from '../types';
import { logAggregator } from './log-aggregator';
import * as Sentry from '@sentry/nextjs';
import { monitoringConfig } from '../config';

class MonitoringServiceImpl implements MonitoringService {
  private metrics: (PerformanceMetric | SystemMetrics)[] = [];
  private customMetrics: Map<string, CustomMetric> = new Map();

  public log(entry: LogEntry): void {
    logAggregator.addLog(entry);

    if (entry.level === 'error' && monitoringConfig.SENTRY_DSN) {
      Sentry.captureMessage(entry.message, {
        level: Sentry.Severity.Error,
        extra: entry.context,
      });
    }
  }

  public recordMetric(metric: PerformanceMetric): void {
    if (Math.random() < monitoringConfig.PERFORMANCE_SAMPLING_RATE) {
      this.metrics.push(metric);
      logAggregator.addMetric(metric);
    }
  }

  public recordError(error: Error, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
    };

    this.log(entry);

    if (monitoringConfig.SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: context,
      });
    }
  }

  public getSystemMetrics(): SystemMetrics {
    const metrics = logAggregator.getSystemMetrics();
    this.metrics.push(metrics);
    return metrics;
  }

  public async getAllMetrics(): Promise<(PerformanceMetric | SystemMetrics)[]> {
    return this.metrics;
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public addCustomMetric(metric: CustomMetric): void {
    this.customMetrics.set(metric.id, {
      ...metric,
      timestamp: new Date().toISOString(),
    });

    // しきい値チェック
    this.checkThresholds(metric);
  }

  public updateCustomMetric(id: string, value: number): void {
    const metric = this.customMetrics.get(id);
    if (metric) {
      const updatedMetric = {
        ...metric,
        value,
        timestamp: new Date().toISOString(),
      };
      this.customMetrics.set(id, updatedMetric);

      // しきい値チェック
      this.checkThresholds(updatedMetric);
    }
  }

  public getCustomMetrics(): CustomMetric[] {
    return Array.from(this.customMetrics.values());
  }

  private checkThresholds(metric: CustomMetric): void {
    if (metric.thresholds) {
      const { warning, critical } = metric.thresholds;

      if (critical !== undefined && metric.value >= critical) {
        this.log({
          level: 'error',
          message: `Critical threshold exceeded for metric ${metric.name}`,
          timestamp: new Date().toISOString(),
          context: {
            metricId: metric.id,
            value: metric.value,
            threshold: critical,
          },
        });
      } else if (warning !== undefined && metric.value >= warning) {
        this.log({
          level: 'warn',
          message: `Warning threshold exceeded for metric ${metric.name}`,
          timestamp: new Date().toISOString(),
          context: {
            metricId: metric.id,
            value: metric.value,
            threshold: warning,
          },
        });
      }
    }
  }
}

export const monitoringService = new MonitoringServiceImpl();