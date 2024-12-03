import type { JobPosting } from '@/types/job-posting';

export function generateJobPostingSchema(jobPosting: JobPosting): Record<string, any> {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: jobPosting.title,
    description: jobPosting.description,
    datePosted: new Date(jobPosting.createdAt).toISOString(),
    employmentType: mapEmploymentType(jobPosting.employmentType),
    hiringOrganization: {
      '@type': 'Organization',
      name: extractCompanyName(jobPosting.companyUrl),
      sameAs: jobPosting.companyUrl,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: jobPosting.location,
        addressCountry: 'JP',
      },
    },
    skills: jobPosting.skills,
    experienceRequirements: jobPosting.experience,
    educationRequirements: jobPosting.education,
    responsibilities: jobPosting.responsibilities,
    qualifications: jobPosting.requirements,
    jobBenefits: jobPosting.benefits,
  };

  // 給与情報が存在する場合のみ追加
  if (jobPosting.salary) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'JPY',
      value: {
        '@type': 'QuantitativeValue',
        value: extractSalaryValue(jobPosting.salary),
        unitText: 'YEAR',
      },
    };
  }

  // 応募締切日が存在する場合のみ追加
  if (jobPosting.applicationDeadline) {
    try {
      const date = new Date(jobPosting.applicationDeadline);
      if (!isNaN(date.getTime())) {
        schema.validThrough = date.toISOString();
      }
    } catch (error) {
      console.warn('Invalid application deadline date:', error);
    }
  }

  return schema;
}

// 雇用形態を schema.org の規定値にマッピング
function mapEmploymentType(type: string): string {
  const mapping: Record<string, string> = {
    '正社員': 'FULL_TIME',
    '契約社員': 'CONTRACTOR',
    'パートタイム': 'PART_TIME',
    'アルバイト': 'PART_TIME',
    '業務委託': 'CONTRACTOR',
    'インターン': 'INTERN',
    '派遣社員': 'TEMPORARY',
  };

  for (const [key, value] of Object.entries(mapping)) {
    if (type.includes(key)) return value;
  }

  return 'OTHER';
}

// URLからドメイン名を抽出して会社名として使用
function extractCompanyName(url: string): string {
  try {
    const domain = new URL(url).hostname
      .replace('www.', '')
      .split('.')
      .slice(0, -1)
      .join('.');
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return '企業名';
  }
}

// 給与文字列から数値を抽出
function extractSalaryValue(salary: string): string {
  const numbers = salary.match(/\d+/g);
  if (!numbers) return '0';
  
  // 最も大きい数値を返す（年収として最も妥当な値を選択）
  return numbers.reduce((max, num) => 
    parseInt(num) > parseInt(max) ? num : max
  );
}