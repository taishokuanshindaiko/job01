import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-4 text-center">
      <div className="p-4 bg-destructive/10 rounded-full">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">エラーが発生しました</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {error.message || "予期せぬエラーが発生しました。"}
        </p>
      </div>
      <Button
        onClick={resetErrorBoundary}
        variant="outline"
        size="lg"
      >
        もう一度試す
      </Button>
    </div>
  )
}