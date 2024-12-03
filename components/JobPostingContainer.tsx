"use client"

import { useState } from "react"
import { JobPostingForm } from "@/components/JobPostingForm"
import { JobPostingPreview } from "@/components/JobPostingPreview"
import { JobPosting } from "@/types/job-posting"

export function JobPostingContainer() {
  const [generatedJobPosting, setGeneratedJobPosting] = useState<JobPosting | null>(null)

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <JobPostingForm onSuccess={setGeneratedJobPosting} />
      {generatedJobPosting && (
        <JobPostingPreview jobPosting={generatedJobPosting} />
      )}
    </div>
  )
}