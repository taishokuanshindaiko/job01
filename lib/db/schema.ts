import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const jobPostings = sqliteTable('job_postings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyUrl: text('company_url').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  requirements: text('requirements').notNull(),
  benefits: text('benefits').notNull(),
  location: text('location').notNull(),
  salary: text('salary'),
  employmentType: text('employment_type').notNull(),
  experience: text('experience').notNull(),
  education: text('education'),
  skills: text('skills').notNull(),
  responsibilities: text('responsibilities').notNull(),
  department: text('department'),
  contactInfo: text('contact_info'),
  applicationDeadline: text('application_deadline'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});