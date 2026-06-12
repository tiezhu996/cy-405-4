export interface ReflectionQuestion {
  id: string;
  question: string;
  answer: string;
  score: number;
}

export interface Reflection {
  id: string;
  interviewId: string;
  questions: ReflectionQuestion[];
  overallFeeling: string;
  improvements: string;
  createdAt: string;
  updatedAt: string;
}

export type ReflectionDraft = Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>;
