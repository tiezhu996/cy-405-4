import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { InterviewStage } from '@/types/enums';
import type { Position, PositionDraft } from '@/types/position';
import { createId, nowIso } from '@/utils/format';
import { readStorage, storageKeys } from '@/utils/storage';

const seedPositions: Position[] = [
  {
    id: 'position_frontend_nova',
    title: '高级前端工程师',
    companyId: 'company_nova',
    salaryRange: '35k-45k * 14',
    location: '上海 / 混合办公',
    jd: '负责 B 端协作产品的性能优化、复杂表单架构与设计系统落地。',
    source: '猎头推荐',
    appliedDate: '2026-05-20',
    stage: InterviewStage.SecondRound,
    createdAt: '2026-05-20T02:00:00.000Z',
    updatedAt: '2026-05-26T04:00:00.000Z'
  },
  {
    id: 'position_growth_pulse',
    title: '增长产品前端',
    companyId: 'company_pulse',
    salaryRange: '30k-40k * 13',
    location: '杭州',
    jd: '搭建医生端增长实验平台，关注数据可视化、AB 实验和低代码配置。',
    source: 'Boss 直聘',
    appliedDate: '2026-05-23',
    stage: InterviewStage.FirstRound,
    createdAt: '2026-05-23T03:20:00.000Z',
    updatedAt: '2026-05-27T02:10:00.000Z'
  },
  {
    id: 'position_platform_slate',
    title: '前端平台工程师',
    companyId: 'company_slate',
    salaryRange: '40k-55k * 15',
    location: '北京',
    jd: '维护多团队组件基础设施、工程规范、可观测性和发布平台。',
    source: '官网投递',
    appliedDate: '2026-05-18',
    stage: InterviewStage.ThirdRound,
    createdAt: '2026-05-18T06:40:00.000Z',
    updatedAt: '2026-05-29T10:30:00.000Z'
  },
  {
    id: 'position_mobile_nova',
    title: '跨端前端负责人',
    companyId: 'company_nova',
    salaryRange: '45k-60k * 14',
    location: '深圳',
    jd: '统一 Web 与小程序体验，推进跨端组件库与质量门禁。',
    source: '内推',
    appliedDate: '2026-05-30',
    stage: InterviewStage.Applied,
    createdAt: '2026-05-30T07:00:00.000Z',
    updatedAt: '2026-05-30T07:00:00.000Z'
  },
  {
    id: 'position_staff_slate',
    title: 'Staff Frontend Engineer',
    companyId: 'company_slate',
    salaryRange: '55k-70k * 15',
    location: '上海',
    jd: '负责交易工作台的前端架构演进、性能预算和核心链路稳定性。',
    source: 'LinkedIn',
    appliedDate: '2026-05-10',
    stage: InterviewStage.Offer,
    createdAt: '2026-05-10T01:15:00.000Z',
    updatedAt: '2026-06-02T09:30:00.000Z'
  }
];

export const usePositionStore = defineStore('position', () => {
  const positions = useLocalStorage<Position[]>(storageKeys.positions, seedPositions);

  const sortedPositions = computed(() =>
    [...positions.value].sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
  );

  function hydrate(): void {
    positions.value = readStorage<Position[]>(storageKeys.positions, seedPositions);
  }

  function addPosition(draft: PositionDraft): Position {
    const timestamp = nowIso();
    const position: Position = {
      ...draft,
      id: createId('position'),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    positions.value.unshift(position);
    return position;
  }

  function updatePosition(id: string, patch: Partial<PositionDraft>): void {
    const position = positions.value.find((item) => item.id === id);
    if (!position) {
      return;
    }

    Object.assign(position, patch, { updatedAt: nowIso() });
  }

  function updateStage(id: string, stage: InterviewStage): void {
    updatePosition(id, { stage });
  }

  function removePosition(id: string): void {
    positions.value = positions.value.filter((position) => position.id !== id);
  }

  function findPosition(id: string): Position | undefined {
    return positions.value.find((position) => position.id === id);
  }

  function byCompany(companyId: string): Position[] {
    return sortedPositions.value.filter((position) => position.companyId === companyId);
  }

  return {
    positions,
    sortedPositions,
    hydrate,
    addPosition,
    updatePosition,
    updateStage,
    removePosition,
    findPosition,
    byCompany
  };
});
