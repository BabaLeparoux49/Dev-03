export type CategoryId = "code" | "redaction" | "analyse" | "general";

export type QuestionInputType = "single" | "multi" | "text";

export type ExportFormat = "chatgpt" | "claude" | "cursor";

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  label: string;
  help?: string;
  inputType: QuestionInputType;
  options?: QuestionOption[];
  placeholder?: string;
  required?: boolean;
  /** Show this question only when answers match these key → value(s) */
  when?: Record<string, string | string[]>;
}

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  accent: string;
}

export interface WizardAnswers {
  [questionId: string]: string | string[];
}

export interface WizardState {
  idea: string;
  categoryId: CategoryId | null;
  answers: WizardAnswers;
  extras: string;
}

export interface TokenEstimate {
  finalPromptTokens: number;
  naiveConversationTokens: number;
  savedTokens: number;
  savedPercent: number;
}
