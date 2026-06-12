<script setup lang="ts">
import { RouterLink } from 'vue-router';
import StatusBadge from './StatusBadge.vue';
import type { Position } from '@/types/position';
import { formatDate } from '@/utils/format';

defineProps<{
  positions: Position[];
}>();
</script>

<template>
  <div v-if="positions.length" class="position-list">
    <RouterLink v-for="position in positions" :key="position.id" class="position-row" :to="`/positions/${position.id}`">
      <span>
        <strong>{{ position.title }}</strong>
        <small>{{ position.source }} · {{ formatDate(position.appliedDate) }}</small>
      </span>
      <StatusBadge :stage="position.stage" />
    </RouterLink>
  </div>
  <p v-else class="empty-inline">暂无关联职位</p>
</template>

<style scoped>
.position-list {
  display: grid;
  gap: 8px;
}

.position-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  background: var(--panel-muted);
}

.position-row strong,
.position-row small {
  display: block;
}

.position-row strong {
  color: var(--text-strong);
  font-size: 14px;
}

.position-row small {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 12px;
}

.empty-inline {
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
