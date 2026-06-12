import type { InterviewMode, InterviewResult, InterviewStage } from './enums';

export interface Interview {
  id: string;
  positionId: string;
  round: InterviewStage;
  result: InterviewResult;
  scheduledAt: string;
  interviewer: string;
  mode: InterviewMode;
  feedback: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type InterviewDraft = Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>;
