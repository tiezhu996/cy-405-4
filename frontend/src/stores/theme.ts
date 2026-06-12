import { computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { storageKeys } from '@/utils/storage';

export type ThemeMode = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  const mode = useLocalStorage<ThemeMode>(storageKeys.theme, 'light');
  const isDark = computed(() => mode.value === 'dark');

  function applyTheme(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = mode.value;
    }
  }

  function setTheme(nextMode: ThemeMode): void {
    mode.value = nextMode;
    applyTheme();
  }

  function toggleTheme(): void {
    setTheme(isDark.value ? 'light' : 'dark');
  }

  watch(mode, applyTheme, { immediate: true });

  return {
    mode,
    isDark,
    setTheme,
    toggleTheme
  };
});
