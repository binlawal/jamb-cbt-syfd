// User types
export type UserRole = 'candidate' | 'tutor' | 'admin' | 'school';
export type UserStatus = 'active' | 'inactive';
export type Cohort = 'SS1' | 'SS2' | 'SS3';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
  cohort: Cohort | null;
  status: UserStatus;
  createdAt: Date;
  lastActiveAt: Date;
}

// School types
export type SchoolType = 'public' | 'private';

export interface School {
  id: string;
  name: string;
  state: string;
  lga: string;
  type: SchoolType;
  address: string;
  createdAt: Date;
}

// Question types
export type QuestionType = 'single-mcq' | 'multiple-mcq' | 'text' | 'numerical';
export type QuestionStatus = 'active' | 'deleted';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  type: QuestionType;
  stem: string;
  passageId: string | null;
  options: QuestionOption[];
  correctAnswers: string[];
  explanation: string | null;
  difficulty: Difficulty;
  tags: string[];
  mediaUrls: string[];
  status: QuestionStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Subject and Topic types
export interface Subject {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  parentTopicId: string | null;
  createdAt: Date;
}

// Exam types
export interface ExamSection {
  id: string;
  subjectId: string;
  timeLimitMinutes: number;
  numQuestions: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

export interface ExamTemplate {
  id: string;
  name: string;
  description: string;
  sections: ExamSection[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExamInstanceStatus = 'scheduled' | 'active' | 'completed';

export interface ExamInstance {
  id: string;
  templateId: string;
  name: string;
  scheduledAt: Date;
  durationMinutes: number;
  allowedRoles: UserRole[];
  status: ExamInstanceStatus;
  createdAt: Date;
}

// Exam Attempt types
export type ExamAttemptStatus = 'in-progress' | 'completed' | 'expired';

export interface ExamResponse {
  questionId: string;
  response: string | string[];
  timeSpentSeconds: number;
  answeredAt: Date;
}

export interface ScoreBreakdown {
  totalScore: number;
  maxScore: number;
  percentage: number;
  subjectScores: Array<{
    subjectId: string;
    score: number;
    maxScore: number;
  }>;
  topicScores: Array<{
    topicId: string;
    score: number;
    maxScore: number;
  }>;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examInstanceId: string;
  questions: string[];
  responses: ExamResponse[];
  flaggedQuestions: string[];
  startedAt: Date;
  submittedAt: Date | null;
  status: ExamAttemptStatus;
  score: number | null;
  scoreBreakdown: ScoreBreakdown | null;
}

// Audit Log types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  ipAddress: string;
  timestamp: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
