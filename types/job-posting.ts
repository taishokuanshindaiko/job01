export interface JobPosting {
  id: number
  companyUrl: string
  title: string
  description: string
  requirements: string
  benefits: string
  location: string
  salary: string | null
  employmentType: string
  experience: string
  education: string | null
  skills: string
  responsibilities: string
  department: string | null
  contactInfo: string | null
  applicationDeadline: string | null
  createdAt: number
  updatedAt: number
}

export interface JobPostingResponse {
  success: boolean
  data?: JobPosting
  error?: string
}