import { Building2, Briefcase } from "lucide-react"

export function JobPostingHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-12 space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          AI求人情報生成システム
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          企業サイトから魅力的な求人情報を自動生成し、検索エンジン最適化された採用ページを作成します
        </p>
      </div>
    </div>
  )
}