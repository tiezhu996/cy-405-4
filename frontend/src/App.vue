<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { darkTheme } from 'naive-ui';
import {
  AnalyticsOutline,
  BriefcaseOutline,
  BusinessOutline,
  CalendarOutline,
  CloudDownloadOutline,
  CloudUploadOutline,
  MoonOutline,
  SunnyOutline,
  GridOutline
} from '@vicons/ionicons5';
import { downloadBackup, loadBackupFile } from '@/api/storage';
import { useCompanyStore } from '@/stores/company';
import { useInterviewStore } from '@/stores/interview';
import { usePositionStore } from '@/stores/position';
import { useReflectionStore } from '@/stores/reflection';
import { useThemeStore } from '@/stores/theme';

const route = useRoute();
const themeStore = useThemeStore();
const companyStore = useCompanyStore();
const positionStore = usePositionStore();
const interviewStore = useInterviewStore();
const reflectionStore = useReflectionStore();
const fileInput = ref<HTMLInputElement | null>(null);
const importStatus = ref('');

const naiveTheme = computed(() => (themeStore.isDark ? darkTheme : null));

const navItems = [
  { path: '/board', label: '看板', icon: GridOutline },
  { path: '/timeline', label: '时间线', icon: CalendarOutline },
  { path: '/stats', label: '统计', icon: AnalyticsOutline },
  { path: '/companies', label: '公司', icon: BusinessOutline }
];

function isActive(path: string): boolean {
  return route.path === path || (path === '/board' && route.path === '/');
}

function handleExport(): void {
  downloadBackup();
}

async function handleImport(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  try {
    await loadBackupFile(file);
    companyStore.hydrate();
    positionStore.hydrate();
    interviewStore.hydrate();
    reflectionStore.hydrate();
    importStatus.value = `已导入 ${file.name}`;
  } catch (error) {
    importStatus.value = error instanceof Error ? error.message : '导入失败';
  } finally {
    input.value = '';
  }
}
</script>

<template>
  <n-config-provider :theme="naiveTheme">
    <n-dialog-provider>
      <n-message-provider>
        <div class="app-shell">
          <aside class="sidebar">
            <RouterLink class="brand" to="/board">
              <span class="brand-mark">
                <n-icon :component="BriefcaseOutline" />
              </span>
              <span>
                <strong>面试排期看板</strong>
                <small>Interview Desk</small>
              </span>
            </RouterLink>

            <nav class="nav-list" aria-label="主导航">
              <RouterLink
                v-for="item in navItems"
                :key="item.path"
                class="nav-item"
                :class="{ active: isActive(item.path) }"
                :to="item.path"
              >
                <n-icon :component="item.icon" />
                <span>{{ item.label }}</span>
              </RouterLink>
            </nav>

            <div class="sidebar-tools">
              <n-button secondary block @click="themeStore.toggleTheme">
                <template #icon>
                  <n-icon :component="themeStore.isDark ? SunnyOutline : MoonOutline" />
                </template>
                {{ themeStore.isDark ? '亮色' : '暗色' }}
              </n-button>
              <n-button secondary block @click="handleExport">
                <template #icon>
                  <n-icon :component="CloudDownloadOutline" />
                </template>
                导出备份
              </n-button>
              <n-button secondary block @click="fileInput?.click()">
                <template #icon>
                  <n-icon :component="CloudUploadOutline" />
                </template>
                导入备份
              </n-button>
              <input ref="fileInput" class="file-input" type="file" accept="application/json" @change="handleImport" />
              <p v-if="importStatus" class="import-status">{{ importStatus }}</p>
            </div>
          </aside>

          <main class="main-content">
            <RouterView />
          </main>
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: var(--nav-width) minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px 16px;
  background: color-mix(in srgb, var(--panel-bg) 86%, transparent);
  border-right: 1px solid var(--line-soft);
  backdrop-filter: blur(16px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px 22px;
  color: var(--text-strong);
}

.brand-mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: var(--brand-contrast);
  background: var(--brand);
  border-radius: var(--radius-md);
}

.brand strong,
.brand small {
  display: block;
}

.brand small {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 12px;
}

.nav-list {
  display: grid;
  gap: 8px;
  margin-top: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 12px;
  color: var(--text-muted);
  border-radius: var(--radius-md);
}

.nav-item:hover,
.nav-item.active {
  color: var(--text-strong);
  background: var(--panel-muted);
}

.sidebar-tools {
  display: grid;
  gap: 10px;
  margin-top: auto;
}

.file-input {
  display: none;
}

.import-status {
  margin: 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.main-content {
  min-width: 0;
  padding: clamp(18px, 3vw, 36px);
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    z-index: 5;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--line-soft);
  }

  .nav-list {
    grid-template-columns: repeat(4, 1fr);
  }

  .nav-item {
    justify-content: center;
  }

  .nav-item span {
    display: none;
  }

  .sidebar-tools {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 14px;
  }
}
</style>
