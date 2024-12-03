"use client"

import { useState } from "react"
import { JobPostingForm } from "@/components/job-posting/JobPostingForm"
import { JobPostingPreview } from "@/components/job-posting/JobPostingPreview"
import { JobPostingPreviewSkeleton } from "@/components/job-posting/JobPostingPreviewSkeleton"
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary"
import { ErrorFallback } from "@/components/error-boundary/ErrorFallback"
import type { JobPosting } from "@/types/job-posting"

export function JobPostingContainer() {
  const [generatedJobPosting, setGeneratedJobPosting] = useState<JobPosting | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async (jobPosting: JobPosting) => {
    setGeneratedJobPosting(jobPosting)
    setIsLoading(false)
  }

  const handleGenerateStart = () => {
    setIsLoading(true)
  }

  const handleReset = () => {
    setGeneratedJobPosting(null)
    setIsLoading(false)
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <ErrorBoundary>
        <JobPostingForm 
          onSuccess={handleGenerate} 
          onGenerateStart={handleGenerateStart}
        />
      </ErrorBoundary>

      {isLoading && <JobPostingPreviewSkeleton />}
      
      {!isLoading && generatedJobPosting && (
        <ErrorBoundary
          fallback={
            <ErrorFallback
              error={new Error("求人情報の表示中にエラーが発生しました")}
              resetErrorBoundary={handleReset}
            />
          }
        >
          <JobPostingPreview jobPosting={generatedJobPosting} />
        </ErrorBoundary>
      )}
    </div>
  )
}