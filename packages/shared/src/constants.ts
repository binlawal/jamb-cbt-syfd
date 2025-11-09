// JAMB Subjects
export const JAMB_SUBJECTS = [
  { code: 'ENG', name: 'English Language' },
  { code: 'MTH', name: 'Mathematics' },
  { code: 'PHY', name: 'Physics' },
  { code: 'CHM', name: 'Chemistry' },
  { code: 'BIO', name: 'Biology' },
  { code: 'ECO', name: 'Economics' },
  { code: 'GOV', name: 'Government' },
  { code: 'LIT', name: 'Literature-in-English' },
  { code: 'CRS', name: 'Christian Religious Studies' },
  { code: 'IRS', name: 'Islamic Religious Studies' },
  { code: 'COM', name: 'Commerce' },
  { code: 'GEO', name: 'Geography' },
  { code: 'ICT', name: 'Information and Communication Technology' },
  { code: 'FMT', name: 'Further Mathematics' },
  { code: 'ACC', name: 'Accounting' },
  { code: 'AGR', name: 'Agricultural Science' },
  { code: 'HAU', name: 'Hausa' },
  { code: 'YOR', name: 'Yoruba' },
  { code: 'IGB', name: 'Igbo' },
] as const;

// Nigerian States
export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'FCT',
] as const;

// User Roles
export const USER_ROLES = ['candidate', 'tutor', 'admin', 'school'] as const;

// Question Types
export const QUESTION_TYPES = ['single-mcq', 'multiple-mcq', 'text', 'numerical'] as const;

// Exam Statuses
export const EXAM_STATUSES = ['scheduled', 'active', 'completed'] as const;

// Attempt Statuses
export const ATTEMPT_STATUSES = ['in-progress', 'completed', 'expired'] as const;

// API Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// JWT Configuration
export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  AUTH_ATTEMPTS: 5,
  AUTH_WINDOW: 15 * 60 * 1000, // 15 minutes
  API_REQUESTS: 100,
  API_WINDOW: 60 * 1000, // 1 minute
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
