"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ExportFormat = "csv" | "json"

export function ExportMetrics() {
  const [isExporting, setIsExporting] = useState(false)
  const [format, setFormat] = useState<ExportFormat>("csv")
  const { toast } = useToast()

  const handleExport = async () => {
    try {
      setIsExporting(true)

      const response = await fetch(`/api/monitoring/export?format=${format}`)
      if (!response.ok) {
        throw new Error("エクスポートに失敗しました")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `metrics-${new Date().toISOString()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "エクスポート完了",
        description: "メトリクスのエクスポートが完了しました",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "エラー",
        description: "メトリクスのエクスポートに失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Select
          value={format}
          onValueChange={(value) => setFormat(value as ExportFormat)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="形式を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              エクスポート中...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              エクスポート
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}