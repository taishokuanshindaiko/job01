import { z } from 'zod';

const monitoringConfigSchema = z.object({
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  SENTRY_DSN: z.string().optional(),
  MONITORING_ENABLED: z.boolean().default(true),
  PERFORMANCE_SAMPLING_RATE: z.number().min(0).max(1).default(0.1),
});

export type MonitoringConfig = z.infer<typeof monitoringConfigSchema>;

export const monitoringConfig: MonitoringConfig = {
  LOG_LEVEL: (process.env.LOG_LEVEL as MonitoringConfig['LOG_LEVEL']) || 'info',
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  MONITORING_ENABLED: process.env.MONITORING_ENABLED !== 'false',
  PERFORMANCE_SAMPLING_RATE: Number(process.env.PERFORMANCE_SAMPLING_RATE) || 0.1,
};