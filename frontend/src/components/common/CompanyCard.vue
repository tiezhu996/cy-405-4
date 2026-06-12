<script setup lang="ts">
import { computed } from 'vue';
import { CreateOutline, TrashOutline } from '@vicons/ionicons5';
import type { Company } from '@/types/company';
import type { Position } from '@/types/position';

const props = defineProps<{
  company: Company;
  positions: Position[];
}>();

defineEmits<{
  edit: [company: Company];
  delete: [company: Company];
}>();

const initial = computed(() => props.company.name.slice(0, 1));
</script>

<template>
  <article class="company-card">
    <header class="company-header">
      <span class="company-logo">
        <img v-if="company.logoUrl" :src="company.logoUrl" :alt="company.name" />
        <span v-else>{{ initial }}</span>
      </span>
      <div class="company-title">
        <h2>{{ company.name }}</h2>
        <p>{{ company.industry }} · {{ company.size }}</p>
      </div>
      <div class="company-actions">
        <n-button quaternary circle @click="$emit('edit', company)">
          <template #icon>
            <n-icon :component="CreateOutline" />
          </template>
        </n-button>
        <n-button quaternary circle type="error" @click="$emit('delete', company)">
          <template #icon>
            <n-icon :component="TrashOutline" />
          </template>
        </n-button>
      </div>
    </header>
    <p class="company-notes">{{ company.notes || '暂无备注' }}</p>
    <footer>
      <span>{{ positions.length }} 个职位</span>
      <slot />
    </footer>
  </article>
</template>

<style scoped>
.company-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-md);
  background: var(--panel-bg);
}

.company-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-logo {
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  place-items: center;
  overflow: hidden;
  color: var(--brand-contrast);
  font-size: 20px;
  font-weight: 800;
  background: var(--brand);
  border-radius: var(--radius-md);
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-title {
  min-width: 0;
}

.company-title h2,
.company-title p {
  margin: 0;
}

.company-title h2 {
  color: var(--text-strong);
  font-size: 20px;
}

.company-title p {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 13px;
}

.company-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.company-notes {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.65;
}

footer {
  display: grid;
  gap: 10px;
}

footer > span {
  color: var(--brand);
  font-size: 13px;
  font-weight: 800;
}
</style>
