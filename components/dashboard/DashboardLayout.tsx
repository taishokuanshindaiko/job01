"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SystemHealth } from "@/components/dashboard/SystemHealth"
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics"
import { ErrorLogs } from "@/components/dashboard/ErrorLogs"
import { ResourceUsage } from "@/components/dashboard/ResourceUsage"
import { CustomMetrics } from "@/components/dashboard/CustomMetrics"
import { ExportMetrics } from "@/components/dashboard/ExportMetrics"
import { Card } from "@/components/ui/card"
import { Activity, AlertTriangle, Cpu, Database, Gauge } from "lucide-react"

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("health")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">システムモニタリング</h1>
        <ExportMetrics />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            システム状態
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            パフォーマンス
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            エラーログ
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            リソース使用状況
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            カスタムメトリクス
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <TabsContent value="health" className="p-6">
            <SystemHealth />
          </TabsContent>
          
          <TabsContent value="performance" className="p-6">
            <PerformanceMetrics />
          </TabsContent>
          
          <TabsContent value="errors" className="p-6">
            <ErrorLogs />
          </TabsContent>
          
          <TabsContent value="resources" className="p-6">
            <ResourceUsage />
          </TabsContent>

          <TabsContent value="custom" className="p-6">
            <CustomMetrics />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
}