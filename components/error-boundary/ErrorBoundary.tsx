"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("エラーバウンダリーでエラーをキャッチ:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-4 text-center">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">エラーが発生しました</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              申し訳ありませんが、予期せぬエラーが発生しました。
              もう一度お試しいただくか、しばらく時間をおいてからアクセスしてください。
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="lg"
          >
            ページを再読み込み
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}