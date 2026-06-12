import { beforeEach, describe, expect, it } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useInterviewStore } from '@/stores/interview';

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

describe('interview store - byPosition (Bug 回归)', () => {
  beforeEach(() => {
    setupLocalStorage();
    window.localStorage.clear();
    setActivePinia(createPinia());
  });

  it('只返回当前 positionId 的面试记录，不会串到其他职位', () => {
    const store = useInterviewStore();
    const positionId = 'position_frontend_nova';

    const records = store.byPosition(positionId);

    expect(records.length).toBeGreaterThan(0);
    for (const record of records) {
      expect(record.positionId).toBe(positionId);
    }
  });

  it('position_frontend_nova 应该返回恰好 2 条记录（一面 + 二面）', () => {
    const store = useInterviewStore();

    const records = store.byPosition('position_frontend_nova');

    expect(records).toHaveLength(2);
    expect(records.map((r) => r.round).sort()).toEqual(['first_round', 'second_round']);
  });

  it('position_platform_slate 应该返回恰好 3 条记录（一面 + 二面 + 三面）', () => {
    const store = useInterviewStore();

    const records = store.byPosition('position_platform_slate');

    expect(records).toHaveLength(3);
    expect(records.map((r) => r.round).sort()).toEqual([
      'first_round',
      'second_round',
      'third_round'
    ]);
  });

  it('不存在的 positionId 应该返回空数组', () => {
    const store = useInterviewStore();

    const records = store.byPosition('position_nonexistent');

    expect(records).toEqual([]);
  });

  it('每个职位的面试记录互不交叉（完整断言）', () => {
    const store = useInterviewStore();
    const allPositionIds = Array.from(new Set(store.interviews.map((i) => i.positionId)));

    for (const pid of allPositionIds) {
      const records = store.byPosition(pid);
      for (const r of records) {
        expect(r.positionId).toBe(pid);
      }
    }
  });
});
