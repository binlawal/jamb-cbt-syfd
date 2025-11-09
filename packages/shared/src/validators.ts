import { z } from 'zod';

// User validators
export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['candidate', 'tutor', 'admin', 'school']),
  schoolId: z.string().uuid().optional(),
  cohort: z.enum(['SS1', 'SS2', 'SS3']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Question validators
export const questionOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  text: z.string(),
});

export const createQuestionSchema = z.object({
  subjectId: z.string().uuid(),
  topicId: z.string().uuid(),
  type: z.enum(['single-mcq', 'multiple-mcq', 'text', 'numerical']),
  stem: z.string().min(10),
  passageId: z.string().uuid().optional(),
  options: z.array(questionOptionSchema).min(2).optional(),
  correctAnswers: z.array(z.string()).min(1),
  explanation: z.string().optional(),
  difficulty: z.number().int().min(1).max(5),
  tags: z.array(z.string()).optional(),
});

// Exam validators
export const examSectionSchema = z.object({
  subjectId: z.string().uuid(),
  timeLimitMinutes: z.number().int().positive(),
  numQuestions: z.number().int().positive(),
  negativeMarking: z.boolean(),
  negativeMarkValue: z.number().min(0),
  shuffleQuestions: z.boolean(),
  shuffleOptions: z.boolean(),
});

export const createExamTemplateSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().max(1000),
  sections: z.array(examSectionSchema).min(1),
});

export const createExamInstanceSchema = z.object({
  templateId: z.string().uuid(),
  name: z.string().min(3).max(200),
  scheduledAt: z.string().datetime(),
  durationMinutes: z.number().int().positive(),
  allowedRoles: z.array(z.enum(['candidate', 'tutor', 'admin', 'school'])).min(1),
});

// Response validators
export const submitResponseSchema = z.object({
  questionId: z.string().uuid(),
  response: z.union([z.string(), z.array(z.string())]),
  timeSpentSeconds: z.number().int().min(0),
});

// Pagination validators
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Filter validators
export const questionFilterSchema = z.object({
  subjectId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  type: z.enum(['single-mcq', 'multiple-mcq', 'text', 'numerical']).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
});

export const userFilterSchema = z.object({
  role: z.enum(['candidate', 'tutor', 'admin', 'school']).optional(),
  schoolId: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const analyticsFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  subjectId: z.string().uuid().optional(),
  schoolId: z.string().uuid().optional(),
  cohort: z.enum(['SS1', 'SS2', 'SS3']).optional(),
});
