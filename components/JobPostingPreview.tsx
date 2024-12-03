"use client"

import { JobPosting } from "@/types/job-posting"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SchemaMarkup } from "@/components/SchemaMarkup"

interface JobPostingPreviewProps {
  jobPosting: JobPosting
}

export function JobPostingPreview({ jobPosting }: JobPostingPreviewProps) {
  return (
    <>
      <SchemaMarkup jobPosting={jobPosting} />
      <Card className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{jobPosting.title}</h2>
              <p className="text-muted-foreground">{jobPosting.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">必須要件</h3>
              <p>{jobPosting.requirements}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">福利厚生</h3>
              <p>{jobPosting.benefits}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">勤務地</h3>
                <p>{jobPosting.location}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">給与</h3>
                <p>{jobPosting.salary}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">雇用形態</h3>
                <p>{jobPosting.employmentType}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">必要経験</h3>
                <p>{jobPosting.experience}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">必要スキル</h3>
              <p>{jobPosting.skills}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">職務内容</h3>
              <p>{jobPosting.responsibilities}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">部署</h3>
                <p>{jobPosting.department}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">学歴要件</h3>
                <p>{jobPosting.education}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">応募方法</h3>
              <p>{jobPosting.contactInfo}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">応募締切</h3>
                <p>{jobPosting.applicationDeadline}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">企業サイト</h3>
                <a href={jobPosting.companyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {jobPosting.companyUrl}
                </a>
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </>
  )
}