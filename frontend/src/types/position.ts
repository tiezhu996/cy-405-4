import type { InterviewStage } from './enums';

export interface Position {
  id: string;
  title: string;
  companyId: string;
  salaryRange: string;
  location: string;
  jd: string;
  source: string;
  appliedDate: string;
  stage: InterviewStage;
  createdAt: string;
  updatedAt: string;
}

export type PositionDraft = Omit<Position, 'id' | 'createdAt' | 'updatedAt'>;
