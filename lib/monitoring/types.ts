import { z } from 'zod';

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  tags?: string[];
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  tags?: string[];
}

export interface SystemMetrics {
  timestamp: string;
  memory: NodeJS.MemoryUsage;
  cpu: NodeJS.CpuUsage;
  uptime: number;
}

export interface CustomMetric {
  id: string;
  name: string;
  description: string;
  type: 'counter' | 'gauge' | 'histogram';
  unit?: string;
  tags?: string[];
  thresholds?: {
    warning?: number;
    critical?: number;
  };
  value: number;
  timestamp: string;
}

export interface MonitoringService {
  log(entry: LogEntry): void;
  recordMetric(metric: PerformanceMetric): void;
  recordError(error: Error, context?: Record<string, unknown>): void;
  getSystemMetrics(): SystemMetrics;
  addCustomMetric(metric: CustomMetric): void;
  updateCustomMetric(id: string, value: number): void;
  getCustomMetrics(): CustomMetric[];
}

export const customMetricSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  type: z.enum(['counter', 'gauge', 'histogram']),
  unit: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thresholds: z.object({
    warning: z.number().optional(),
    critical: z.number().optional(),
  }).optional(),
  value: z.number(),
  timestamp: z.string(),
});

export type CustomMetricInput = z.infer<typeof customMetricSchema>;