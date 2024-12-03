"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useTheme } from "next-themes"
import type { PerformanceMetric } from "@/lib/monitoring/types"

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/monitoring/metrics")
        const data = await response.json()
        if (data.success) {
          setMetrics(data.data)
        }
      } catch (error) {
        console.error("メトリクスの取得に失敗:", error)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000)
    return () => clearInterval(interval)
  }, [])

  const chartColor = theme === "dark" ? "#fff" : "#000"

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">パフォーマンスメトリクス</h2>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">レスポンスタイム (ms)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                  stroke={chartColor}
                />
                <YAxis stroke={chartColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                    border: "none",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">メモリ使用量 (MB)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                  stroke={chartColor}
                />
                <YAxis stroke={chartColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                    border: "none",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}