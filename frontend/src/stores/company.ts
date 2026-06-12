import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Company, CompanyDraft } from '@/types/company';
import { createId, nowIso } from '@/utils/format';
import { readStorage, storageKeys } from '@/utils/storage';

const seedCompanies: Company[] = [
  {
    id: 'company_nova',
    name: '北辰云创',
    industry: '企业服务',
    size: '500-1000人',
    logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=nova',
    notes: '产品线成熟，团队强调交付节奏。',
    createdAt: '2026-05-12T02:30:00.000Z',
    updatedAt: '2026-05-12T02:30:00.000Z'
  },
  {
    id: 'company_pulse',
    name: 'PulseLab',
    industry: '医疗科技',
    size: '100-500人',
    logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=pulselab',
    notes: 'AI 医疗方向，面试更看重业务理解。',
    createdAt: '2026-05-14T07:10:00.000Z',
    updatedAt: '2026-05-14T07:10:00.000Z'
  },
  {
    id: 'company_slate',
    name: 'Slate Works',
    industry: '金融科技',
    size: '1000人以上',
    logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=slate',
    notes: '流程规范，HR 反馈及时。',
    createdAt: '2026-05-15T03:25:00.000Z',
    updatedAt: '2026-05-15T03:25:00.000Z'
  }
];

export const useCompanyStore = defineStore('company', () => {
  const companies = useLocalStorage<Company[]>(storageKeys.companies, seedCompanies);

  const sortedCompanies = computed(() => [...companies.value].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')));

  function hydrate(): void {
    companies.value = readStorage<Company[]>(storageKeys.companies, seedCompanies);
  }

  function addCompany(draft: CompanyDraft): Company {
    const timestamp = nowIso();
    const company: Company = {
      ...draft,
      id: createId('company'),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    companies.value.unshift(company);
    return company;
  }

  function updateCompany(id: string, patch: Partial<CompanyDraft>): void {
    const company = companies.value.find((item) => item.id === id);
    if (!company) {
      return;
    }

    Object.assign(company, patch, { updatedAt: nowIso() });
  }

  function removeCompany(id: string): void {
    companies.value = companies.value.filter((company) => company.id !== id);
  }

  function findCompany(id: string): Company | undefined {
    return companies.value.find((company) => company.id === id);
  }

  return {
    companies,
    sortedCompanies,
    hydrate,
    addCompany,
    updateCompany,
    removeCompany,
    findCompany
  };
});
