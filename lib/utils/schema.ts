import type { JobPosting } from '@/types/job-posting';

export function generateSchemaMarkup(jobPosting: JobPosting): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: jobPosting.title,
    description: jobPosting.description,
    datePosted: new Date(jobPosting.createdAt).toISOString(),
    employmentType: jobPosting.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: new URL(jobPosting.companyUrl).hostname,
      sameAs: jobPosting.companyUrl
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: jobPosting.location,
        addressCountry: 'JP'
      }
    },
    skills: jobPosting.skills,
    experienceRequirements: jobPosting.experience,
    educationRequirements: jobPosting.education,
    responsibilities: jobPosting.responsibilities,
    qualifications: jobPosting.requirements,
    jobBenefits: jobPosting.benefits
  };
}