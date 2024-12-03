"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Gauge, AlertTriangle } from "lucide-react"
import type { CustomMetric } from "@/lib/monitoring/types"

export function CustomMetrics() {
  const [metrics, setMetrics] = useState<CustomMetric[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const [newMetric, setNewMetric] = useState({
    name: "",
    description: "",
    type: "gauge" as const,
    unit: "",
    value: 0,
  })

  const handleAddMetric = async () => {
    try {
      const response = await fetch("/api/monitoring/custom-metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          ...newMetric,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("メトリクスの追加に失敗しました")
      }

      const { data } = await response.json()
      setMetrics([...metrics, data])
      setIsAdding(false)
      setNewMetric({
        name: "",
        description: "",
        type: "gauge",
        unit: "",
        value: 0,
      })

      toast({
        title: "メトリクスを追加しました",
        description: `${data.name} を追加しました`,
      })
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "メトリクスの追加に失敗しました",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (metric: CustomMetric) => {
    if (!metric.thresholds) return "bg-primary"
    const { warning, critical } = metric.thresholds
    if (critical !== undefined && metric.value >= critical) return "bg-destructive"
    if (warning !== undefined && metric.value >= warning) return "bg-warning"
    return "bg-primary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">カスタムメトリクス</h2>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          メトリクスを追加
        </Button>
      </div>

      {isAdding && (
        <Card className="p-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">メトリクス名</Label>
                <Input
                  id="name"
                  value={newMetric.name}
                  onChange={(e) =>
                    setNewMetric({ ...newMetric, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">タイプ</Label>
                <Select
                  value={newMetric.type}
                  onValueChange={(value) =>
                    setNewMetric({
                      ...newMetric,
                      type: value as "counter" | "gauge" | "histogram",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="counter">カウンター</SelectItem>
                    <SelectItem value="gauge">ゲージ</SelectItem>
                    <SelectItem value="histogram">ヒストグラム</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Input
                id="description"
                value={newMetric.description}
                onChange={(e) =>
                  setNewMetric({ ...newMetric, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">単位</Label>
                <Input
                  id="unit"
                  value={newMetric.unit}
                  onChange={(e) =>
                    setNewMetric({ ...newMetric, unit: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">初期値</Label>
                <Input
                  id="value"
                  type="number"
                  value={newMetric.value}
                  onChange={(e) =>
                    setNewMetric({
                      ...newMetric,
                      value: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <Button onClick={handleAddMetric}>追加</Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${getStatusColor(metric)}`}>
                  <Gauge className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{metric.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {metric.value}
                  {metric.unit && (
                    <span className="text-sm text-muted-foreground ml-1">
                      {metric.unit}
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  最終更新: {new Date(metric.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            {metric.thresholds && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>
                  警告: {metric.thresholds.warning}
                  {metric.unit}
                </span>
                <AlertTriangle className="h-4 w-4 text-destructive ml-4" />
                <span>
                  危険: {metric.thresholds.critical}
                  {metric.unit}
                </span>
              </div>
            )}
          </Card>
        ))}

        {metrics.length === 0 && !isAdding && (
          <div className="text-center text-muted-foreground py-8">
            カスタムメトリクスはまだありません
          </div>
        )}
      </div>
    </div>
  )
}