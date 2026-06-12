import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { InterviewMode, InterviewResult, InterviewStage } from '@/types/enums';
import type { Interview, InterviewDraft } from '@/types/interview';
import { createId, nowIso } from '@/utils/format';
import { readStorage, storageKeys } from '@/utils/storage';

const seedInterviews: Interview[] = [
  {
    id: 'interview_nova_first',
    positionId: 'position_frontend_nova',
    round: InterviewStage.FirstRound,
    result: InterviewResult.Passed,
    scheduledAt: '2026-05-24T06:00:00.000Z',
    interviewer: '技术负责人 / 周遥',
    mode: InterviewMode.Video,
    feedback: '框架基础扎实，追问性能优化时回答完整。',
    notes: '<p>重点复习：虚拟列表、请求竞态、Monorepo 依赖治理。</p>',
    createdAt: '2026-05-21T05:00:00.000Z',
    updatedAt: '2026-05-24T07:30:00.000Z'
  },
  {
    id: 'interview_nova_second',
    positionId: 'position_frontend_nova',
    round: InterviewStage.SecondRound,
    result: InterviewResult.Pending,
    scheduledAt: '2026-06-12T07:30:00.000Z',
    interviewer: '前端架构师 / Elaine',
    mode: InterviewMode.Video,
    feedback: '',
    notes: '<p>准备一个组件库治理案例，突出取舍与落地成本。</p>',
    createdAt: '2026-05-27T02:00:00.000Z',
    updatedAt: '2026-05-27T02:00:00.000Z'
  },
  {
    id: 'interview_pulse_first',
    positionId: 'position_growth_pulse',
    round: InterviewStage.FirstRound,
    result: InterviewResult.Pending,
    scheduledAt: '2026-06-11T01:30:00.000Z',
    interviewer: '增长团队 Lead',
    mode: InterviewMode.Phone,
    feedback: '',
    notes: '<p>准备 AB 实验、埋点方案和仪表盘设计。</p>',
    createdAt: '2026-05-25T01:00:00.000Z',
    updatedAt: '2026-05-25T01:00:00.000Z'
  },
  {
    id: 'interview_slate_first',
    positionId: 'position_platform_slate',
    round: InterviewStage.FirstRound,
    result: InterviewResult.Passed,
    scheduledAt: '2026-05-22T03:00:00.000Z',
    interviewer: '平台组 Manager',
    mode: InterviewMode.Video,
    feedback: '工程化经验匹配，建议补充成本收益量化。',
    notes: '<p>问到 pnpm workspace、CI 缓存、组件发布策略。</p>',
    createdAt: '2026-05-19T08:00:00.000Z',
    updatedAt: '2026-05-22T04:30:00.000Z'
  },
  {
    id: 'interview_slate_second',
    positionId: 'position_platform_slate',
    round: InterviewStage.SecondRound,
    result: InterviewResult.Passed,
    scheduledAt: '2026-05-28T08:00:00.000Z',
    interviewer: 'Staff Engineer',
    mode: InterviewMode.Video,
    feedback: '系统设计较好，稳定性方案仍可更细。',
    notes: '<p>画了发布平台架构，补充灰度与回滚指标。</p>',
    createdAt: '2026-05-23T04:00:00.000Z',
    updatedAt: '2026-05-28T10:20:00.000Z'
  },
  {
    id: 'interview_slate_third',
    positionId: 'position_platform_slate',
    round: InterviewStage.ThirdRound,
    result: InterviewResult.Pending,
    scheduledAt: '2026-06-13T02:00:00.000Z',
    interviewer: '业务 VP',
    mode: InterviewMode.Onsite,
    feedback: '',
    notes: '<p>准备跨团队推进和冲突处理案例。</p>',
    createdAt: '2026-05-29T11:00:00.000Z',
    updatedAt: '2026-05-29T11:00:00.000Z'
  },
  {
    id: 'interview_staff_offer',
    positionId: 'position_staff_slate',
    round: InterviewStage.Offer,
    result: InterviewResult.Passed,
    scheduledAt: '2026-06-02T09:00:00.000Z',
    interviewer: 'HRBP',
    mode: InterviewMode.Phone,
    feedback: '已进入薪资沟通。',
    notes: '<p>关注期权归属、试用期目标和远程政策。</p>',
    createdAt: '2026-06-01T03:00:00.000Z',
    updatedAt: '2026-06-02T09:40:00.000Z'
  }
];

export const useInterviewStore = defineStore('interview', () => {
  const interviews = useLocalStorage<Interview[]>(storageKeys.interviews, seedInterviews);

  const sortedInterviews = computed(() =>
    [...interviews.value].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
  );

  function hydrate(): void {
    interviews.value = readStorage<Interview[]>(storageKeys.interviews, seedInterviews);
  }

  function addInterview(draft: InterviewDraft): Interview {
    const timestamp = nowIso();
    const interview: Interview = {
      ...draft,
      id: createId('interview'),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    interviews.value.unshift(interview);
    return interview;
  }

  function updateInterview(id: string, patch: Partial<InterviewDraft>): void {
    const interview = interviews.value.find((item) => item.id === id);
    if (!interview) {
      return;
    }

    Object.assign(interview, patch, { updatedAt: nowIso() });
  }

  function removeInterview(id: string): void {
    interviews.value = interviews.value.filter((interview) => interview.id !== id);
  }

  function byPosition(positionId: string): Interview[] {
    return sortedInterviews.value.filter((interview) => interview.positionId === positionId);
  }

  return {
    interviews,
    sortedInterviews,
    hydrate,
    addInterview,
    updateInterview,
    removeInterview,
    byPosition
  };
});
