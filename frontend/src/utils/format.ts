import dayjs from 'dayjs';
import { interviewModeLabels, interviewResultLabels, interviewStageLabels } from '@/types/enums';
import type { InterviewMode, InterviewResult, InterviewStage } from '@/types/enums';

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatDate(value: string, fallback = '未设置'): string {
  if (!value) {
    return fallback;
  }

  return dayjs(value).format('YYYY-MM-DD');
}

export function formatDateTime(value: string, fallback = '未设置'): string {
  if (!value) {
    return fallback;
  }

  return dayjs(value).format('YYYY-MM-DD HH:mm');
}

export function toDateTimeInputValue(value: string): string {
  if (!value) {
    return '';
  }

  return dayjs(value).format('YYYY-MM-DDTHH:mm');
}

export function fromDateTimeInputValue(value: string): string {
  if (!value) {
    return nowIso();
  }

  return dayjs(value).toISOString();
}

export function stageLabel(stage: InterviewStage): string {
  return interviewStageLabels[stage];
}

export function resultLabel(result: InterviewResult): string {
  return interviewResultLabels[result];
}

export function modeLabel(mode: InterviewMode): string {
  return interviewModeLabels[mode];
}
