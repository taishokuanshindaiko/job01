"use client"

import { useState } from "react"
import { JobPostingResponse } from "@/types/job-posting"
import { MESSAGES } from "@/lib/constants/messages"
import { saveJobPosting } from "@/lib/storage/client"

export function useJobPosting() {
  const [isLoading, setIsLoading] = useState(false)

  const generateJobPosting = async (url: string): Promise<JobPostingResponse> => {
    if (!url) {
      return { 
        success: false, 
        error: MESSAGES.ERRORS.URL_REQUIRED 
      }
    }

    setIsLoading(true)
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || MESSAGES.ERRORS.GENERATION_FAILED);
      }

      const result = await response.json();

      if (!result.data) {
        throw new Error(MESSAGES.ERRORS.INVALID_RESPONSE_FORMAT);
      }

      const storageResult = saveJobPosting(result.data);
      if (!storageResult.success) {
        throw new Error(MESSAGES.ERRORS.STORAGE_ERROR);
      }

      return { 
        success: true, 
        data: storageResult.data 
      };
    } catch (error) {
      console.error("求人情報生成エラー:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : MESSAGES.ERRORS.GENERATION_FAILED 
      };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    generateJobPosting,
  }
}