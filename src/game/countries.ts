export type CountryCode = 'UK' | 'USA' | 'AUS' | 'NGA' | 'DEU' | 'JPN';

export interface ExamConfig {
  age: number;
  name: string;
  subject: string;
  description: string;
  passThreshold: number;
}

export interface SchoolStage {
  name: string;
  startAge: number;
  endAge: number;
}

export interface JobTier {
  tier: 1 | 2 | 3;
  label: string;
  titles: string[];
  baseSalary: number;
  requiresUniversity: boolean;
  minAcademic: number;
  minReputation: number;
  minAge: number;
}

export interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  currencySymbol: string;
  schoolStages: SchoolStage[];
  exams: ExamConfig[];
  universityEntryAge: number;
  minimumWorkingAge: number;
  retirementAge: number;
  salaryMultiplier: number;
  jobMarketLabel: string;
  jobTiers: JobTier[];
}

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  UK: {
    code: 'UK', name: 'United Kingdom', flag: '🇬🇧', currencySymbol: '£',
    schoolStages: [
      { name: 'Primary School', startAge: 5, endAge: 10 },
      { name: 'Secondary School', startAge: 11, endAge: 15 },
      { name: 'Sixth Form', startAge: 16, endAge: 17 },
    ],
    exams: [
      { age: 11, name: 'SATs', subject: 'English, Maths & Science', description: 'National curriculum tests at the end of primary school. Results influence secondary school placement.', passThreshold: 40 },
      { age: 16, name: 'GCSEs', subject: '9 subjects', description: 'General Certificate of Secondary Education. The most important exams of your early life. Results define your sixth form options.', passThreshold: 55 },
      { age: 18, name: 'A-Levels', subject: '3 subjects', description: 'Advanced Level qualifications. Your university entrance ticket. Three subjects, two years, everything on the line.', passThreshold: 65 },
    ],
    universityEntryAge: 18, minimumWorkingAge: 16, retirementAge: 67, salaryMultiplier: 1.0,
    jobMarketLabel: 'Job Market',
    jobTiers: [
      { tier: 1, label: 'Entry Level', titles: ['Customer Assistant', 'Admin Clerk', 'Warehouse Operative', 'Apprentice Technician'], baseSalary: 18, requiresUniversity: false, minAcademic: 0, minReputation: 0, minAge: 16 },
      { tier: 2, label: 'Mid Level', titles: ['Office Manager', 'Sales Executive', 'Skilled Tradesperson', 'Junior Analyst'], baseSalary: 32, requiresUniversity: false, minAcademic: 50, minReputation: 20, minAge: 21 },
      { tier: 3, label: 'Senior / Professional', titles: ['Senior Manager', 'Solicitor', 'Finance Director', 'Consultant'], baseSalary: 58, requiresUniversity: true, minAcademic: 70, minReputation: 35, minAge: 24 },
    ],
  },

  USA: {
    code: 'USA', name: 'United States', flag: '🇺🇸', currencySymbol: '$',
    schoolStages: [
      { name: 'Elementary School', startAge: 5, endAge: 10 },
      { name: 'Middle School', startAge: 11, endAge: 13 },
      { name: 'High School', startAge: 14, endAge: 17 },
    ],
    exams: [
      { age: 13, name: 'State Assessments', subject: 'Reading & Math', description: 'Standardised state tests at the end of middle school. Results affect high school track placement.', passThreshold: 40 },
      { age: 16, name: 'PSAT', subject: 'Reading, Math & Writing', description: 'Preliminary SAT — a practice run with real consequences. High scorers qualify for National Merit scholarships.', passThreshold: 50 },
      { age: 17, name: 'SAT / ACT', subject: 'Reading, Math, Science & Writing', description: 'The college entrance exam. The number that follows you to every university application.', passThreshold: 65 },
    ],
    universityEntryAge: 18, minimumWorkingAge: 16, retirementAge: 65, salaryMultiplier: 1.15,
    jobMarketLabel: 'Job Board',
    jobTiers: [
      { tier: 1, label: 'Entry Level', titles: ['Retail Associate', 'Server', 'Warehouse Worker', 'Call Centre Agent'], baseSalary: 22, requiresUniversity: false, minAcademic: 0, minReputation: 0, minAge: 16 },
      { tier: 2, label: 'Mid Level', titles: ['Sales Manager', 'IT Technician', 'Marketing Coordinator', 'Paralegal'], baseSalary: 38, requiresUniversity: false, minAcademic: 50, minReputation: 20, minAge: 21 },
      { tier: 3, label: 'Senior / Professional', titles: ['VP of Operations', 'Attorney', 'Software Engineer', 'Financial Advisor'], baseSalary: 72, requiresUniversity: true, minAcademic: 70, minReputation: 35, minAge: 24 },
    ],
  },

  AUS: {
    code: 'AUS', name: 'Australia', flag: '🇦🇺', currencySymbol: 'A$',
    schoolStages: [
      { name: 'Primary School', startAge: 5, endAge: 11 },
      { name: 'Junior Secondary', startAge: 12, endAge: 15 },
      { name: 'Senior Secondary', startAge: 16, endAge: 17 },
    ],
    exams: [
      { age: 11, name: 'NAPLAN', subject: 'Literacy & Numeracy', description: 'National Assessment Program. Taken nationwide, results shared with your school and parents.', passThreshold: 40 },
      { age: 15, name: 'Year 10 Assessments', subject: 'Core subjects', description: 'End of junior secondary assessments. Determines which senior subjects and pathways you can access.', passThreshold: 50 },
      { age: 17, name: 'HSC / VCE / ATAR', subject: 'Selected subjects', description: 'The Higher School Certificate and Australian Tertiary Admission Rank. Your score out of 99.95 that determines university entry.', passThreshold: 65 },
    ],
    universityEntryAge: 18, minimumWorkingAge: 15, retirementAge: 67, salaryMultiplier: 1.1,
    jobMarketLabel: 'Jobs Board',
    jobTiers: [
      { tier: 1, label: 'Entry Level', titles: ['Retail Assistant', 'Labourer', 'Hospitality Worker', 'Administration Officer'], baseSalary: 24, requiresUniversity: false, minAcademic: 0, minReputation: 0, minAge: 15 },
      { tier: 2, label: 'Mid Level', titles: ['Project Coordinator', 'Trades Supervisor', 'Account Manager', 'Nurse'], baseSalary: 40, requiresUniversity: false, minAcademic: 50, minReputation: 20, minAge: 21 },
      { tier: 3, label: 'Senior / Professional', titles: ['Senior Engineer', 'Barrister', 'Operations Director', 'Surgeon'], baseSalary: 68, requiresUniversity: true, minAcademic: 70, minReputation: 35, minAge: 24 },
    ],
  },

  NGA: {
    code: 'NGA', name: 'Nigeria', flag: '🇳🇬', currencySymbol: '₦',
    schoolStages: [
      { name: 'Primary School', startAge: 6, endAge: 11 },
      { name: 'Junior Secondary', startAge: 12, endAge: 14 },
      { name: 'Senior Secondary', startAge: 15, endAge: 17 },
    ],
    exams: [
      { age: 11, name: 'Primary School Leaving Cert', subject: 'English, Maths & General Studies', description: 'The First School Leaving Certificate. Required to enter junior secondary school.', passThreshold: 38 },
      { age: 14, name: 'Junior WAEC (BECE)', subject: 'Core subjects', description: 'Basic Education Certificate Examination. The gate between junior and senior secondary school.', passThreshold: 50 },
      { age: 17, name: 'WAEC / NECO', subject: '9 subjects', description: 'West African Senior School Certificate. The qualification that defines your university and career options across West Africa.', passThreshold: 63 },
    ],
    universityEntryAge: 18, minimumWorkingAge: 16, retirementAge: 60, salaryMultiplier: 0.7,
    jobMarketLabel: 'Job Market',
    jobTiers: [
      { tier: 1, label: 'Entry Level', titles: ['Market Trader', 'Security Guard', 'Shop Attendant', 'Artisan'], baseSalary: 8, requiresUniversity: false, minAcademic: 0, minReputation: 0, minAge: 16 },
      { tier: 2, label: 'Mid Level', titles: ['Bank Officer', 'Sales Representative', 'Technician', 'Civil Servant'], baseSalary: 18, requiresUniversity: false, minAcademic: 50, minReputation: 20, minAge: 21 },
      { tier: 3, label: 'Senior / Professional', titles: ['Branch Manager', 'Barrister', 'Engineer', 'Senior Civil Servant'], baseSalary: 35, requiresUniversity: true, minAcademic: 70, minReputation: 35, minAge: 24 },
    ],
  },

  DEU: {
    code: 'DEU', name: 'Germany', flag: '🇩🇪', currencySymbol: '€',
    schoolStages: [
      { name: 'Grundschule', startAge: 6, endAge: 9 },
      { name: 'Gymnasium / Realschule', startAge: 10, endAge: 15 },
      { name: 'Oberstufe', startAge: 16, endAge: 17 },
    ],
    exams: [
      { age: 10, name: 'Grundschulempfehlung', subject: 'Core subjects', description: 'Primary school track recommendation — determines whether you enter Gymnasium (academic), Realschule (technical), or Hauptschule (vocational). One of the most consequential assessments of your life.', passThreshold: 45 },
      { age: 15, name: 'Mittlere Reife', subject: 'All subjects', description: 'The intermediate school leaving certificate. Required to access the Oberstufe and ultimately the Abitur.', passThreshold: 55 },
      { age: 18, name: 'Abitur', subject: '5 subjects', description: 'The German university entrance qualification. Graded 1.0 to 4.0 — a 1.0 opens every door in Germany.', passThreshold: 68 },
    ],
    universityEntryAge: 18, minimumWorkingAge: 15, retirementAge: 67, salaryMultiplier: 1.05,
    jobMarketLabel: 'Stellenmarkt',
    jobTiers: [
      { tier: 1, label: 'Ausbildung / Entry', titles: ['Auszubildender', 'Verkäufer', 'Lagerarbeiter', 'Bürokaufmann'], baseSalary: 20, requiresUniversity: false, minAcademic: 0, minReputation: 0, minAge: 15 },
      { tier: 2, label: 'Fachkraft', titles: ['Meister', 'Sachbearbeiter', 'Techniker', 'Fachwirt'], baseSalary: 36, requiresUniversity: false, minAcademic: 50, minReputation: 20, minAge: 22 },
      { tier: 3, label: 'Leitungsebene', titles: ['Abteilungsleiter', 'Ingenieur', 'Rechtsanwalt', 'Unternehmensberater'], baseSalary: 62, requiresUniversity: true, minAcademic: 70, minReputation: 35, minAge: 25 },
    ],
  },

  JPN: {
    code: 'JPN', name: 'Japan', flag: '🇯🇵', currencySymbol: '¥',
    schoolStages: [
      { name: 'Shōgakkō (Primary)', startAge: 6, endAge: 11 },
      { name: 'Chūgakkō (Middle)', startAge: 12, endAge: 14 },
      { name: 'Kōtōgakkō (High School)', startAge: 15, endAge: 17 },
    ],
    exams: [
      { age: 12, name: 'Chūgaku Entrance Exams', subject: 'Japanese, Maths & Science', description: 'Middle school entrance exams — critical for those aiming at elite private schools that feed directly into top universities.', passThreshold: 42 },
      { age: 15, name: 'High School Entrance Exams', subject: 'Five core subjects', description: 'The high school entrance examination. Which school you enter determines your social network, your university prospects, and your career.', passThreshold: 55 },
      { age: 18, name: 'University Entrance Exam (共通テスト)', subject: '6–8 subjects', description: 'The National Centre Test for University Admissions. Taken on a single January weekend. One shot at the score that determines your future.', passThreshold: 68 },
    ],
    universityEntryAge: 18, minimumWorkingAge: 16, retirementAge: 65, salaryMultiplier: 0.95,
    jobMarketLabel: 'Job Listings',
    jobTiers: [
      { tier: 1, label: 'Part-time / Entry', titles: ['Arubaito', 'Convenience Store Clerk', 'Factory Worker', 'Office Junior'], baseSalary: 19, requiresUniversity: false, minAcademic: 0, minReputation: 0, minAge: 16 },
      { tier: 2, label: 'Seishain (Regular)', titles: ['Salaryman', 'Sales Staff', 'Mid-Level Technician', 'Section Chief'], baseSalary: 34, requiresUniversity: false, minAcademic: 50, minReputation: 20, minAge: 22 },
      { tier: 3, label: 'Kachō / Buchō (Management)', titles: ['Department Head', 'Senior Engineer', 'Corporate Lawyer', 'Executive Director'], baseSalary: 60, requiresUniversity: true, minAcademic: 70, minReputation: 35, minAge: 28 },
    ],
  },
};

// Pure utility functions — engine calls these, never checks country code directly

export function getCountry(code: CountryCode): CountryConfig {
  return COUNTRIES[code];
}

export function getExamAtAge(config: CountryConfig, age: number): ExamConfig | null {
  return config.exams.find(e => e.age === age) ?? null;
}

export function getCurrentSchoolStage(config: CountryConfig, age: number): SchoolStage | null {
  return config.schoolStages.find(s => age >= s.startAge && age <= s.endAge) ?? null;
}

export function isSchoolAge(config: CountryConfig, age: number): boolean {
  return config.schoolStages.some(s => age >= s.startAge && age <= s.endAge);
}

export function getEligibleJobs(config: CountryConfig, playerAge: number, academicIntelligence: number, reputation: number, universityLocked: boolean): JobTier[] {
  return config.jobTiers.filter(job => {
    if (playerAge < job.minAge) return false;
    if (job.requiresUniversity && universityLocked) return false;
    if (academicIntelligence < job.minAcademic) return false;
    if (reputation < job.minReputation) return false;
    return true;
  });
}

export function getNextExam(config: CountryConfig, currentAge: number): ExamConfig | null {
  return config.exams.find(e => e.age > currentAge) ?? null;
}

export function formatSalary(config: CountryConfig, baseSalary: number): string {
  const adjusted = Math.round(baseSalary * config.salaryMultiplier * 1000);
  return `${config.currencySymbol}${adjusted.toLocaleString()}`;
}
