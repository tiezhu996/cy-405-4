import { beforeEach, describe, expect, it } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePositionStore } from '@/stores/position';
import { InterviewStage } from '@/types/enums';

function setupLocalStorage(): void {
  if (!window.localStorage) {
    const store = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key),
        clear: () => store.clear()
      },
      writable: true
    });
  }
}

describe('position store - updateStage (Bug 回归)', () => {
  beforeEach(() => {
    setupLocalStorage();
    window.localStorage.clear();
    setActivePinia(createPinia());
  });

  it('拖动到一面后 stage 应为 FirstRound，而非硬编码的 Applied', () => {
    const store = usePositionStore();
    const targetId = store.positions[0].id;

    store.updateStage(targetId, InterviewStage.FirstRound);

    const updated = store.findPosition(targetId);
    expect(updated?.stage).toBe(InterviewStage.FirstRound);
  });

  it('拖动到二面后 stage 应为 SecondRound', () => {
    const store = usePositionStore();
    const targetId = store.positions[0].id;

    store.updateStage(targetId, InterviewStage.SecondRound);

    const updated = store.findPosition(targetId);
    expect(updated?.stage).toBe(InterviewStage.SecondRound);
  });

  it('拖动到 Offer 后 stage 应为 Offer', () => {
    const store = usePositionStore();
    const targetId = store.positions[0].id;

    store.updateStage(targetId, InterviewStage.Offer);

    const updated = store.findPosition(targetId);
    expect(updated?.stage).toBe(InterviewStage.Offer);
  });

  it('所有看板阶段都能被正确持久化（不会退回 Applied）', () => {
    const store = usePositionStore();
    const targetId = store.positions[0].id;
    const stages = [
      InterviewStage.Applied,
      InterviewStage.FirstRound,
      InterviewStage.SecondRound,
      InterviewStage.ThirdRound,
      InterviewStage.Offer
    ];

    for (const stage of stages) {
      store.updateStage(targetId, stage);
      expect(store.findPosition(targetId)?.stage).toBe(stage);
    }
  });
});
