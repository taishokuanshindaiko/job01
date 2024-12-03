"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function JobPostingPreviewSkeleton() {
  return (
    <Card className="p-6">
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-32 w-full" />
          </div>

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  )
}