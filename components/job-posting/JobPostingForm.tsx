"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Loader2, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateJobPosting } from "@/lib/api/job-postings"
import type { JobPosting } from "@/types/job-posting"

interface JobPostingFormProps {
  onSuccess: (jobPosting: JobPosting) => void
  onGenerateStart: () => void
}

export function JobPostingForm({ onSuccess, onGenerateStart }: JobPostingFormProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      toast({
        title: "エラー",
        description: "URLを入力してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    onGenerateStart()

    try {
      const response = await generateJobPosting(url)
      
      if (response.success && response.data) {
        toast({
          title: "生成完了",
          description: "求人情報の生成が完了しました。",
        })
        onSuccess(response.data)
        setUrl("")
      } else {
        throw new Error(response.error || "求人情報の生成に失敗しました。")
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "求人情報の生成に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url" className="text-base">
            企業サイトURL
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            企業の採用ページまたはトップページのURLを入力してください
          </p>
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              生成中...
            </>
          ) : (
            "求人情報を生成"
          )}
        </Button>
      </form>
    </Card>
  )
}