import type { PerformanceMetric, SystemMetrics } from "./types";

export function formatMetricsToCSV(
  metrics: (PerformanceMetric | SystemMetrics)[]
): string {
  if (metrics.length === 0) return "";

  // ヘッダーの生成
  const headers = Object.keys(metrics[0]).filter(key => 
    typeof metrics[0][key as keyof (PerformanceMetric | SystemMetrics)] !== "object"
  );
  
  const rows = [
    headers.join(","),
    ...metrics.map(metric => 
      headers.map(header => {
        const value = metric[header as keyof (PerformanceMetric | SystemMetrics)];
        if (typeof value === "string" || typeof value === "number") {
          return typeof value === "string" ? `"${value}"` : value;
        }
        return "";
      }).join(",")
    )
  ];

  return rows.join("\n");
}

export function formatMetricsToJSON(
  metrics: (PerformanceMetric | SystemMetrics)[]
): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      metrics: metrics.map(metric => ({
        ...metric,
        exportedAt: new Date().toISOString(),
      })),
    },
    null,
    2
  );
}

export function validateExportFormat(format: string): format is "csv" | "json" {
  return ["csv", "json"].includes(format);
}