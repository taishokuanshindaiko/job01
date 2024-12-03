"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Clock } from "lucide-react"
import type { LogEntry } from "@/lib/monitoring/types"

export function ErrorLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/monitoring/logs")
        const data = await response.json()
        if (data.success) {
          setLogs(data.data.filter((log: LogEntry) => log.level === "error"))
        }
      } catch (error) {
        console.error("エラーログの取得に失敗:", error)
      }
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">エラーログ</h2>
        <Badge variant="secondary">
          {logs.length}件のエラー
        </Badge>
      </div>

      <Card>
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-4">
            {logs.map((log, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-destructive/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-destructive">
                      {log.error?.name || "エラー"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
                
                <p className="text-sm">{log.message}</p>
                
                {log.error?.stack && (
                  <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                    {log.error.stack}
                  </pre>
                )}

                {log.context && (
                  <div className="text-sm">
                    <h4 className="font-semibold mb-1">コンテキスト:</h4>
                    <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                エラーログはありません
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}