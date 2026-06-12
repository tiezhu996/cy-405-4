import { computed, unref } from 'vue';
import type { MaybeRef } from 'vue';
import { buildFunnelData } from '@/utils/chart-helpers';
import type { Interview } from '@/types/interview';
import type { Position } from '@/types/position';

export function useFunnelData(positions: MaybeRef<Position[]>, interviews: MaybeRef<Interview[]>) {
  const data = computed(() => buildFunnelData(unref(positions), unref(interviews)));
  const offerRate = computed(() => {
    const items = data.value;
    return items[items.length - 1]?.rate ?? 0;
  });

  return {
    data,
    offerRate
  };
}
