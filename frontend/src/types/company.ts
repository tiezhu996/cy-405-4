export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  logoUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type CompanyDraft = Omit<Company, 'id' | 'createdAt' | 'updatedAt'>;
