import { defineStore } from 'pinia';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Reflection, ReflectionDraft } from '@/types/reflection';
import { createId, nowIso } from '@/utils/format';
import { readStorage, storageKeys } from '@/utils/storage';

const seedReflections: Reflection[] = [
  {
    id: 'reflection_slate_second',
    interviewId: 'interview_slate_second',
    questions: [
      {
        id: 'question_slate_arch',
        question: '如何设计组件发布平台的灰度策略？',
        answer: '从包版本、业务白名单、监控指标和快速回滚四层展开。',
        score: 4
      }
    ],
    overallFeeling: '节奏紧，但追问方向清晰。系统设计需要更量化。',
    improvements: '补充发布失败率、回滚耗时、缓存命中率等指标。',
    createdAt: '2026-05-28T11:00:00.000Z',
    updatedAt: '2026-05-28T11:00:00.000Z'
  }
];

export const useReflectionStore = defineStore('reflection', () => {
  const reflections = useLocalStorage<Reflection[]>(storageKeys.reflections, seedReflections);

  function hydrate(): void {
    reflections.value = readStorage<Reflection[]>(storageKeys.reflections, seedReflections);
  }

  function upsertReflection(interviewId: string, draft: Omit<ReflectionDraft, 'interviewId'>): Reflection {
    const current = reflections.value.find((reflection) => reflection.interviewId === interviewId);
    const timestamp = nowIso();

    if (current) {
      Object.assign(current, draft, { updatedAt: timestamp });
      return current;
    }

    const reflection: Reflection = {
      ...draft,
      id: createId('reflection'),
      interviewId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    reflections.value.unshift(reflection);
    return reflection;
  }

  function removeReflection(id: string): void {
    reflections.value = reflections.value.filter((reflection) => reflection.id !== id);
  }

  function byInterview(interviewId: string): Reflection | undefined {
    return reflections.value.find((reflection) => reflection.interviewId === interviewId);
  }

  return {
    reflections,
    hydrate,
    upsertReflection,
    removeReflection,
    byInterview
  };
});
