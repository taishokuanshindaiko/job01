import { LogEntry, PerformanceMetric, SystemMetrics } from '../types';
import { monitoringConfig } from '../config';
import { log } from '../logger';

class LogAggregator {
  private static instance: LogAggregator;
  private logBuffer: LogEntry[] = [];
  private metricsBuffer: PerformanceMetric[] = [];
  private readonly bufferSize = 100;
  private readonly flushInterval = 5000; // 5秒

  private constructor() {
    this.startPeriodicFlush();
  }

  public static getInstance(): LogAggregator {
    if (!LogAggregator.instance) {
      LogAggregator.instance = new LogAggregator();
    }
    return LogAggregator.instance;
  }

  public addLog(entry: LogEntry): void {
    this.logBuffer.push({
      ...entry,
      timestamp: new Date().toISOString(),
    });

    if (this.logBuffer.length >= this.bufferSize) {
      this.flush();
    }

    // 重要なログはすぐに出力
    if (entry.level === 'error' || entry.level === 'warn') {
      log[entry.level](entry.message, entry.context);
    }
  }

  public addMetric(metric: PerformanceMetric): void {
    this.metricsBuffer.push({
      ...metric,
      timestamp: new Date().toISOString(),
    });
  }

  private async flush(): Promise<void> {
    if (this.logBuffer.length === 0 && this.metricsBuffer.length === 0) {
      return;
    }

    try {
      // ログの送信
      if (this.logBuffer.length > 0) {
        await this.sendLogs(this.logBuffer);
        this.logBuffer = [];
      }

      // メトリクスの送信
      if (this.metricsBuffer.length > 0) {
        await this.sendMetrics(this.metricsBuffer);
        this.metricsBuffer = [];
      }
    } catch (error) {
      console.error('Failed to flush logs/metrics:', error);
    }
  }

  private async sendLogs(logs: LogEntry[]): Promise<void> {
    if (!monitoringConfig.MONITORING_ENABLED) return;

    try {
      await fetch('/api/monitoring/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      });
    } catch (error) {
      console.error('Failed to send logs:', error);
    }
  }

  private async sendMetrics(metrics: PerformanceMetric[]): Promise<void> {
    if (!monitoringConfig.MONITORING_ENABLED) return;

    try {
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }

  private startPeriodicFlush(): void {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  public getSystemMetrics(): SystemMetrics {
    return {
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime(),
    };
  }
}

export const logAggregator = LogAggregator.getInstance();