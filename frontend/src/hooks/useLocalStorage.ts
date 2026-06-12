import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { readStorage, writeStorage } from '@/utils/storage';
import type { StorageKey } from '@/utils/storage';

export function useLocalStorage<T>(key: StorageKey | string, defaultValue: T): Ref<T> {
  const state = ref(readStorage<T>(key, defaultValue)) as Ref<T>;

  watch(
    state,
    (value) => {
      writeStorage(key, value);
    },
    { deep: true }
  );

  return state;
}
