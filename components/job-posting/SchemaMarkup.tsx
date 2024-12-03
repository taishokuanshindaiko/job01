"use client"

import { generateJobPostingSchema } from '@/lib/schema/job-posting';
import type { JobPosting } from '@/types/job-posting';
import { useEffect, useState } from 'react';

interface SchemaMarkupProps {
  jobPosting: JobPosting;
}

export function SchemaMarkup({ jobPosting }: SchemaMarkupProps) {
  const [schemaString, setSchemaString] = useState<string>('');

  useEffect(() => {
    try {
      const schemaData = generateJobPostingSchema(jobPosting);
      setSchemaString(JSON.stringify(schemaData));
    } catch (error) {
      console.error('Error generating schema markup:', error);
    }
  }, [jobPosting]);

  if (!schemaString) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
    />
  );
}