import { describe, expect, it } from 'vitest';
import { buildFunnelData } from '@/utils/chart-helpers';
import { InterviewStage, interviewStageLabels } from '@/types/enums';
import type { Interview } from '@/types/interview';
import type { Position } from '@/types/position';

const mockPositions: Position[] = [
  {
    id: 'p1',
    title: 'A',
    companyId: 'c1',
    salaryRange: '',
    location: '',
    jd: '',
    source: '',
    appliedDate: '2026-05-01',
    stage: InterviewStage.Applied,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z'
  },
  {
    id: 'p2',
    title: 'B',
    companyId: 'c1',
    salaryRange: '',
    location: '',
    jd: '',
    source: '',
    appliedDate: '2026-05-02',
    stage: InterviewStage.FirstRound,
    createdAt: '2026-05-02T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z'
  },
  {
    id: 'p3',
    title: 'C',
    companyId: 'c2',
    salaryRange: '',
    location: '',
    jd: '',
    source: '',
    appliedDate: '2026-05-03',
    stage: InterviewStage.SecondRound,
    createdAt: '2026-05-03T00:00:00.000Z',
    updatedAt: '2026-05-03T00:00:00.000Z'
  },
  {
    id: 'p4',
    title: 'D',
    companyId: 'c2',
    salaryRange: '',
    location: '',
    jd: '',
    source: '',
    appliedDate: '2026-05-04',
    stage: InterviewStage.ThirdRound,
    createdAt: '2026-05-04T00:00:00.000Z',
    updatedAt: '2026-05-04T00:00:00.000Z'
  },
  {
    id: 'p5',
    title: 'E',
    companyId: 'c3',
    salaryRange: '',
    location: '',
    jd: '',
    source: '',
    appliedDate: '2026-05-05',
    stage: InterviewStage.Offer,
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z'
  }
];

const mockInterviews: Interview[] = [];

describe('chart-helpers - buildFunnelData (Bug 回归)', () => {
  it('漏斗必须包含 5 个阶段：投递、一面、二面、三面、Offer', () => {
    const data = buildFunnelData(mockPositions, mockInterviews);

    expect(data).toHaveLength(5);
  });

  it('漏斗阶段顺序必须是 投递 → 一面 → 二面 → 三面 → Offer', () => {
    const data = buildFunnelData(mockPositions, mockInterviews);

    expect(data.map((d) => d.stage)).toEqual([
      InterviewStage.Applied,
      InterviewStage.FirstRound,
      InterviewStage.SecondRound,
      InterviewStage.ThirdRound,
      InterviewStage.Offer
    ]);
  });

  it('漏斗阶段名称必须与 interviewStageLabels 一致，不会把三面标成二面', () => {
    const data = buildFunnelData(mockPositions, mockInterviews);

    expect(data.map((d) => d.name)).toEqual([
      interviewStageLabels[InterviewStage.Applied],
      interviewStageLabels[InterviewStage.FirstRound],
      interviewStageLabels[InterviewStage.SecondRound],
      interviewStageLabels[InterviewStage.ThirdRound],
      interviewStageLabels[InterviewStage.Offer]
    ]);
  });

  it('漏斗值必须严格递减或相等（不会出现中间阶段为 0 导致跳变）', () => {
    const data = buildFunnelData(mockPositions, mockInterviews);
    const values = data.map((d) => d.value);

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeLessThanOrEqual(values[i - 1]);
    }
  });

  it('完整场景：5 个职位分别在 5 个阶段，各阶段计数应为 5,4,3,2,1', () => {
    const data = buildFunnelData(mockPositions, mockInterviews);

    expect(data.map((d) => d.value)).toEqual([5, 4, 3, 2, 1]);
  });

  it('不会出现从一面直接跳到三面（SecondRound 不会缺失）', () => {
    const data = buildFunnelData(mockPositions, mockInterviews);
    const stages = data.map((d) => d.stage);

    expect(stages).toContain(InterviewStage.SecondRound);
    const firstIdx = stages.indexOf(InterviewStage.FirstRound);
    const secondIdx = stages.indexOf(InterviewStage.SecondRound);
    const thirdIdx = stages.indexOf(InterviewStage.ThirdRound);
    expect(secondIdx).toBe(firstIdx + 1);
    expect(thirdIdx).toBe(secondIdx + 1);
  });
});
