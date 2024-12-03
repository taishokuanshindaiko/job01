export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatSalary(salary: string): string {
  const amount = salary.match(/\d+/g);
  if (!amount) return salary;
  
  return salary.replace(
    /\d+/g, 
    num => Number(num).toLocaleString('ja-JP')
  );
}

export function formatSkills(skills: string): string[] {
  return skills
    .split(/[、,]/)
    .map(skill => skill.trim())
    .filter(Boolean);
}