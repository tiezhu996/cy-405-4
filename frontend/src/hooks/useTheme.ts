import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';

export function useTheme() {
  const themeStore = useThemeStore();

  return {
    mode: computed(() => themeStore.mode),
    isDark: computed(() => themeStore.isDark),
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme
  };
}
