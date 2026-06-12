import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { setActivePinia, createPinia } from 'pinia';
import { usePositionStore } from '@/stores/position';
import { InterviewStage } from '@/types/enums';
import { storageKeys } from '@/utils/storage';

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

describe('position store - 刷新后阶段恢复（持久化回归）', () => {
  beforeEach(() => {
    setupLocalStorage();
    window.localStorage.clear();
    setActivePinia(createPinia());
  });

  it('更新到一面后刷新（重建 store）阶段仍为 FirstRound', async () => {
    const targetId = usePositionStore().positions[0].id;

    {
      const store = usePositionStore();
      store.updateStage(targetId, InterviewStage.FirstRound);
      await nextTick();
    }

    setActivePinia(createPinia());
    const restored = usePositionStore();

    expect(restored.findPosition(targetId)?.stage).toBe(InterviewStage.FirstRound);
  });

  it('更新到二面后刷新（重建 store）阶段仍为 SecondRound', async () => {
    const targetId = usePositionStore().positions[0].id;

    {
      const store = usePositionStore();
      store.updateStage(targetId, InterviewStage.SecondRound);
      await nextTick();
    }

    setActivePinia(createPinia());
    const restored = usePositionStore();

    expect(restored.findPosition(targetId)?.stage).toBe(InterviewStage.SecondRound);
  });

  it('更新到 Offer 后刷新（重建 store）阶段仍为 Offer', async () => {
    const targetId = usePositionStore().positions[0].id;

    {
      const store = usePositionStore();
      store.updateStage(targetId, InterviewStage.Offer);
      await nextTick();
    }

    setActivePinia(createPinia());
    const restored = usePositionStore();

    expect(restored.findPosition(targetId)?.stage).toBe(InterviewStage.Offer);
  });

  it('localStorage 中实际写入了更新后的阶段值', async () => {
    const targetId = usePositionStore().positions[0].id;

    const store = usePositionStore();
    store.updateStage(targetId, InterviewStage.ThirdRound);
    await nextTick();

    const raw = window.localStorage.getItem(storageKeys.positions);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    const target = parsed.find((p: { id: string }) => p.id === targetId);
    expect(target.stage).toBe(InterviewStage.ThirdRound);
  });

  it('刷新后不会把已更新的阶段重置为 Applied（原 Bug 场景）', async () => {
    const targetId = usePositionStore().positions[0].id;

    {
      const store = usePositionStore();
      store.updateStage(targetId, InterviewStage.FinalRound);
      await nextTick();
    }

    setActivePinia(createPinia());
    const restored = usePositionStore();
    expect(restored.findPosition(targetId)?.stage).not.toBe(InterviewStage.Applied);
    expect(restored.findPosition(targetId)?.stage).toBe(InterviewStage.FinalRound);
  });
});
