import { NextResponse } from "next/server";
import { monitoringService } from "@/lib/monitoring/services/monitoring";
import { rateLimit } from "@/lib/api/rate-limit";
import { formatMetricsToCSV, formatMetricsToJSON } from "@/lib/monitoring/export";

export async function GET(request: Request) {
  try {
    const rateLimitResult = await rateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "csv";

    // メトリクスデータの取得
    const metrics = await monitoringService.getAllMetrics();

    let data: string;
    let contentType: string;
    let filename: string;

    if (format === "csv") {
      data = formatMetricsToCSV(metrics);
      contentType = "text/csv";
      filename = `metrics-${new Date().toISOString()}.csv`;
    } else {
      data = formatMetricsToJSON(metrics);
      contentType = "application/json";
      filename = `metrics-${new Date().toISOString()}.json`;
    }

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export metrics" },
      { status: 500 }
    );
  }
}