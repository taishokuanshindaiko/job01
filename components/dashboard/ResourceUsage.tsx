"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, HardDrive, Memory } from "lucide-react"
import type { SystemMetrics } from "@/lib/monitoring/types"

export function ResourceUsage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/monitoring/health")
        const data = await response.json()
        if (data.success) {
          setMetrics(data.data)
        }
      } catch (error) {
        console.error("リソース使用状況の取得に失敗:", error)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!metrics) {
    return null
  }

  const formatBytes = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  const calculatePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">リソース使用状況</h2>

      <div className="grid gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Memory className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">メモリ使用量</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>使用中: {formatBytes(metrics.memory.heapUsed)}</span>
              <span>合計: {formatBytes(metrics.memory.heapTotal)}</span>
            </div>
            <Progress
              value={calculatePercentage(
                metrics.memory.heapUsed,
                metrics.memory.heapTotal
              )}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">CPU使用率</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>ユーザー時間: {metrics.cpu.user / 1000}ms</span>
              <span>システム時間: {metrics.cpu.system / 1000}ms</span>
            </div>
            <Progress
              value={calculatePercentage(
                metrics.cpu.user + metrics.cpu.system,
                process.uptime() * 1000000
              )}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">外部メモリ</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>使用中: {formatBytes(metrics.memory.external)}</span>
              <span>RSS: {formatBytes(metrics.memory.rss)}</span>
            </div>
            <Progress
              value={calculatePercentage(
                metrics.memory.external,
                metrics.memory.rss
              )}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}