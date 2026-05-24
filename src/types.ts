export type AcademicLevel = 'school' | 'highschool' | 'university' | 'postgrad';

export type AcademicSubject = 
  | 'mathematics' 
  | 'physics_chemistry' 
  | 'humanities_essay' 
  | 'computer_science' 
  | 'law_political' 
  | 'medicine_biology' 
  | 'economics_business' 
  | 'languages';

export type CitationStyle = 
  | 'APA7' 
  | 'APA6' 
  | 'IEEE' 
  | 'MLA' 
  | 'Vancouver' 
  | 'Chicago' 
  | 'Harvard' 
  | 'ICONTEC';

export type TutorPersona = 'socratic' | 'rigorous' | 'step_by_step' | 'humanized';

export type LanguageCode = 'es' | 'en' | 'fr' | 'pt' | 'de' | 'it' | 'ja' | 'zh' | 'ar' | 'ru' | 'ko';

export interface CitationReference {
  id: string;
  author: string;
  title: string;
  year: string;
  publisher?: string;
  url?: string;
  citationText: string; // The formatted citation based on current style
}

export interface TaskSolution {
  originalQuestion: string;
  resolvedText: string;
  stepExplanation: string[];
  formulas?: string[];
  visualMapHtml?: string;
  references: CitationReference[];
  academicLevel: AcademicLevel;
  subject: AcademicSubject;
  citationStyle: CitationStyle;
  wordCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  files?: { name: string; type: string; url?: string; size: string }[];
  isPending?: boolean;
  citationReferences?: CitationReference[];
  stepByStepDetails?: string[];
  reasoningOpened?: boolean;
}

export interface AcademicDocument {
  title: string;
  institution: string;
  faculty: string;
  subjectName: string;
  authorName: string;
  tutorName: string;
  locationAndYear: string;
  includeTableOfContents: boolean;
  sections: { title: string; paragraphs: string[] }[];
  references: CitationReference[];
}

export interface PodMetric {
  name: string;
  status: 'running' | 'pending' | 'failed';
  cpuUsage: number; // in percentage
  memoryUsage: number; // in MB
  restarts: number;
  ip: string;
}

export interface ServiceMetric {
  name: string;
  replicasRequested: number;
  replicasActual: number;
  pods: PodMetric[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  service: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface CreditStatus {
  subscriptionPlan: 'free' | 'premium';
  creditsRemaining: number;
  creditsMax: number;
  totalTokensUsed: number;
  nextRenewalDate: string;
}
