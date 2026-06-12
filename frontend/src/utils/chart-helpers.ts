import dayjs from 'dayjs';
import type { Company } from '@/types/company';
import { InterviewStage, interviewStageLabels, stageRank } from '@/types/enums';
import type { Interview } from '@/types/interview';
import type { Position } from '@/types/position';

export interface ChartPoint {
  name: string;
  value: number;
}

export interface FunnelPoint extends ChartPoint {
  stage: InterviewStage;
  rate: number;
}

function maxReachedStage(position: Position, interviews: Interview[]): InterviewStage {
  return interviews.reduce((current, interview) => {
    return stageRank[interview.round] > stageRank[current] ? interview.round : current;
  }, position.stage);
}

export function buildFunnelData(positions: Position[], interviews: Interview[]): FunnelPoint[] {
  const total = Math.max(positions.length, 1);
  const stages = [
    InterviewStage.Applied,
    InterviewStage.FirstRound,
    InterviewStage.SecondRound,
    InterviewStage.ThirdRound,
    InterviewStage.Offer
  ];

  return stages.map((stage) => {
    const value = positions.filter((position) => {
      const reached = maxReachedStage(
        position,
        interviews.filter((interview) => interview.positionId === position.id)
      );
      return stageRank[reached] >= stageRank[stage];
    }).length;

    return {
      name: interviewStageLabels[stage],
      stage,
      value,
      rate: Math.round((value / total) * 100)
    };
  });
}

export function buildHeatMapData(interviews: Interview[]): [number, number, number][] {
  const buckets = new Map<string, number>();
  interviews.forEach((interview) => {
    const date = dayjs(interview.scheduledAt);
    const key = `${date.day()}-${date.hour()}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });

  return Array.from(buckets.entries()).map(([key, value]) => {
    const [day, hour] = key.split('-').map(Number);
    return [hour, day, value];
  });
}

export function buildCompanyPie(positions: Position[], companies: Company[]): ChartPoint[] {
  return companies
    .map((company) => ({
      name: company.name,
      value: positions.filter((position) => position.companyId === company.id).length
    }))
    .filter((point) => point.value > 0);
}

export function buildIndustryPie(positions: Position[], companies: Company[]): ChartPoint[] {
  const companyMap = new Map(companies.map((company) => [company.id, company]));
  const buckets = new Map<string, number>();

  positions.forEach((position) => {
    const industry = companyMap.get(position.companyId)?.industry ?? '未归类';
    buckets.set(industry, (buckets.get(industry) ?? 0) + 1);
  });

  return Array.from(buckets.entries()).map(([name, value]) => ({ name, value }));
}
