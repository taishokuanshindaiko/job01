"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SystemMetrics } from "@/lib/monitoring/types"

export function SystemHealth() {
  const [health, setHealth] = useState<SystemMetrics | null>(null)
  const [status, setStatus] = useState<"healthy" | "unhealthy" | "loading">("loading")
  const { toast } = useToast()

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/monitoring/health")
        const data = await response.json()

        if (data.success) {
          setHealth(data.data)
          setStatus(data.data.status)
        } else {
          throw new Error(data.error)
        }
      } catch (error) {
        setStatus("unhealthy")
        toast({
          title: "エラー",
          description: "システム状態の取得に失敗しました",
          variant: "destructive",
        })
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [toast])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">システム状態</h2>
        <Badge variant={status === "healthy" ? "default" : "destructive"}>
          {status === "healthy" ? (
            <CheckCircle className="h-4 w-4 mr-1" />
          ) : (
            <XCircle className="h-4 w-4 mr-1" />
          )}
          {status === "healthy" ? "正常" : "異常"}
        </Badge>
      </div>

      {health && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">稼働時間</h3>
            </div>
            <p className="text-2xl font-bold">
              {Math.floor(health.uptime / 3600)}時間{" "}
              {Math.floor((health.uptime % 3600) / 60)}分
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">最終更新</h3>
            </div>
            <p className="text-2xl font-bold">
              {new Date(health.timestamp).toLocaleString()}
            </p>
          </Card>
        </div>
      )}

      {status === "unhealthy" && (
        <Alert variant="destructive">
          <AlertTitle>システム異常を検知</AlertTitle>
          <AlertDescription>
            システムの状態が異常です。管理者に連絡してください。
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}