<script setup lang="ts">
import type { BoardStage } from '@/types/enums';

defineProps<{
  title: string;
  stage: BoardStage;
  count: number;
  description?: string;
}>();
</script>

<template>
  <section class="kanban-column" :data-stage="stage">
    <header class="column-header">
      <div>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </div>
      <span>{{ count }}</span>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.kanban-column {
  display: flex;
  flex-direction: column;
  min-width: 275px;
  min-height: 560px;
  padding: 12px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--panel-muted) 58%, transparent);
}

.column-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.column-header h2 {
  margin: 0;
  color: var(--text-strong);
  font-size: 17px;
  line-height: 1.2;
}

.column-header p {
  margin: 5px 0 0;
  color: var(--text-muted);
  font-size: 12px;
}

.column-header span {
  display: grid;
  min-width: 30px;
  height: 30px;
  place-items: center;
  color: var(--brand);
  font-size: 13px;
  font-weight: 800;
  border: 1px solid color-mix(in srgb, var(--brand) 34%, transparent);
  border-radius: 999px;
  background: var(--panel-bg);
}
</style>
