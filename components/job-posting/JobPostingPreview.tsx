"use client"

import { JobPosting } from "@/types/job-posting"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/formatting"
import { SchemaMarkup } from "@/components/job-posting/SchemaMarkup"
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Calendar,
  Clock,
  Users,
  Mail
} from "lucide-react"

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

            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                icon={MapPin}
                label="勤務地"
                value={jobPosting.location}
              />
              <InfoItem
                icon={Building2}
                label="雇用形態"
                value={jobPosting.employmentType}
              />
              <InfoItem
                icon={Briefcase}
                label="必要経験"
                value={jobPosting.experience}
              />
              <InfoItem
                icon={GraduationCap}
                label="学歴要件"
                value={jobPosting.education || "不問"}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="h-5 w-5" />
                必須要件
              </h3>
              <p>{jobPosting.requirements}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">必要なスキル</h3>
              <div className="flex flex-wrap gap-2">
                {jobPosting.skills.split(/[、,]/).map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                職務内容
              </h3>
              <p>{jobPosting.responsibilities}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">福利厚生</h3>
              <p>{jobPosting.benefits}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">給与</h3>
                <p>{jobPosting.salary}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">所属部門</h3>
                <p>{jobPosting.department || "未定"}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                応募方法
              </h3>
              <p>{jobPosting.contactInfo || "企業サイトよりご応募ください"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  応募締切
                </h3>
                <p>
                  {jobPosting.applicationDeadline 
                    ? formatDate(jobPosting.applicationDeadline)
                    : "随時"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">企業サイト</h3>
                <a 
                  href={jobPosting.companyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
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

interface InfoItemProps {
  icon: React.ElementType
  label: string
  value: string
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {label}
      </h3>
      <p>{value}</p>
    </div>
  )
}