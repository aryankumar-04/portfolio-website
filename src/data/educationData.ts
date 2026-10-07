// ============================================================================
// Education and Certifications Data
// ============================================================================

// Real asset and document paths in public directory
export const VIDHYANJALI_LOGO_PATH = '/education/vidhyanjali.svg';
export const ST_XAVIERS_LOGO_PATH = '/education/xaviers.svg';
export const HACKERRANK_LOGO_PATH = '/education/hackerrank.svg';

// Verification URLs for certificates
export const CERT_SQL_VERIFY_URL = 'https://www.hackerrank.com/certificates/7e5a52fa2796';
export const CERT_REST_API_VERIFY_URL = 'https://www.hackerrank.com/certificates/eefc22fa6410';
export const CERT_PROBLEM_SOLVING_VERIFY_URL = 'https://www.hackerrank.com/certificates/63bb73230186';

// Certificate PDF document paths (for preview modal and download)
export const CERT_SQL_PDF_PATH = '/pdf/sql_advanced certificate.pdf';
export const CERT_REST_API_PDF_PATH = '/pdf/rest_api_intermediate certificate.pdf';
export const CERT_PROBLEM_SOLVING_PDF_PATH = '/pdf/problem_solving_intermediate certificate.pdf';

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  date: string;
  logo: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  certId: string;
  issuedDate: string;
  logo: string;
  verifyUrl: string;
  pdfPath: string;
}

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    id: 'vidhyanjali-academy',
    school: 'Vidhyanjali Academy, Kota',
    degree: 'Senior Secondary Education (CBSE) • PCM',
    date: 'Apr 2024 – May 2026',
    logo: VIDHYANJALI_LOGO_PATH,
  },
  {
    id: 'st-xaviers-school',
    school: "St. Xavier's School, Durgapur",
    degree: 'Secondary Education (ICSE) • General Studies',
    date: 'Dec 2012 – May 2024',
    logo: ST_XAVIERS_LOGO_PATH,
  },
];

export const CERTIFICATION_ITEMS: CertificationItem[] = [
  {
    id: 'sql-advanced',
    name: 'SQL (Advanced)',
    issuer: 'HackerRank',
    certId: '7E5A52FA2796',
    issuedDate: 'Issued Jul 2026',
    logo: HACKERRANK_LOGO_PATH,
    verifyUrl: CERT_SQL_VERIFY_URL,
    pdfPath: CERT_SQL_PDF_PATH,
  },
  {
    id: 'rest-api-intermediate',
    name: 'Rest API (Intermediate)',
    issuer: 'HackerRank',
    certId: 'EEFC22FA6410',
    issuedDate: 'Issued Jul 2026',
    logo: HACKERRANK_LOGO_PATH,
    verifyUrl: CERT_REST_API_VERIFY_URL,
    pdfPath: CERT_REST_API_PDF_PATH,
  },
  {
    id: 'problem-solving-intermediate',
    name: 'Problem Solving (Intermediate)',
    issuer: 'HackerRank',
    certId: '63BB73230186',
    issuedDate: 'Issued Jul 2026',
    logo: HACKERRANK_LOGO_PATH,
    verifyUrl: CERT_PROBLEM_SOLVING_VERIFY_URL,
    pdfPath: CERT_PROBLEM_SOLVING_PDF_PATH,
  },
];
