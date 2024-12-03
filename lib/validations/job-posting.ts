import { z } from 'zod'
import { MESSAGES } from '@/lib/constants/messages'

const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

export const jobPostingSchema = z.object({
  title: z.string()
    .min(5, 'タイトルは5文字以上で入力してください')
    .max(100, 'タイトルは100文字以内で入力してください'),
  
  description: z.string()
    .min(50, '説明は50文字以上で入力してください')
    .max(1000, '説明は1000文字以内で入力してください'),
  
  requirements: z.string()
    .min(30, '応募要件は30文字以上で入力してください')
    .max(500, '応募要件は500文字以内で入力してください'),
  
  benefits: z.string()
    .min(30, '福利厚生は30文字以上で入力してください')
    .max(500, '福利厚生は500文字以内で入力してください'),
  
  location: z.string()
    .min(3, '勤務地は3文字以上で入力してください')
    .max(100, '勤務地は100文字以内で入力してください'),
  
  salary: z.string()
    .nullable()
    .transform(val => val || '応相談'),
  
  employmentType: z.string()
    .min(2, '雇用形態は2文字以上で入力してください')
    .max(50, '雇用形態は50文字以内で入力してください'),
  
  experience: z.string()
    .min(5, '必要経験は5文字以上で入力してください')
    .max(200, '必要経験は200文字以内で入力してください'),
  
  education: z.string()
    .nullable()
    .transform(val => val || '不問'),
  
  skills: z.string()
    .min(5, '必要なスキルは5文字以上で入力してください')
    .max(300, '必要なスキルは300文字以内で入力してください'),
  
  responsibilities: z.string()
    .min(50, '職務内容は50文字以上で入力してください')
    .max(1000, '職務内容は1000文字以内で入力してください'),
  
  department: z.string()
    .nullable()
    .transform(val => val || '未定'),
  
  contactInfo: z.string()
    .nullable()
    .transform(val => val || '企業サイトよりご応募ください'),
  
  applicationDeadline: z.string()
    .nullable()
    .transform(val => val || '随時'),
  
  companyUrl: z.string()
    .regex(urlRegex, MESSAGES.ERRORS.INVALID_URL)
    .min(1, MESSAGES.ERRORS.URL_REQUIRED),
})

export type JobPostingInput = z.infer<typeof jobPostingSchema>

export const jobPostingFormSchema = jobPostingSchema.extend({
  companyUrl: z.string()
    .regex(urlRegex, MESSAGES.ERRORS.INVALID_URL)
    .min(1, MESSAGES.ERRORS.URL_REQUIRED),
})

export type JobPostingFormData = z.infer<typeof jobPostingFormSchema>