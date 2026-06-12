<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import StatusBadge from './StatusBadge.vue';
import type { Company } from '@/types/company';
import { interviewModeLabels, interviewStageLabels } from '@/types/enums';
import type { Interview } from '@/types/interview';
import type { Position } from '@/types/position';
import { formatDateTime } from '@/utils/format';

const props = defineProps<{
  interview: Interview;
  position?: Position;
  company?: Company;
}>();

const logoFallback = computed(() => props.company?.name.slice(0, 1) ?? '?');
</script>

<template>
  <article class="timeline-node">
    <span class="timeline-dot" aria-hidden="true">
      <img v-if="company?.logoUrl" :src="company.logoUrl" :alt="company.name" />
      <span v-else>{{ logoFallback }}</span>
    </span>

    <div class="timeline-content">
      <header>
        <div>
          <RouterLink v-if="position" class="node-title" :to="`/positions/${position.id}`">
            {{ company?.name ?? '未关联公司' }} · {{ position.title }}
          </RouterLink>
          <strong v-else class="node-title">未知职位</strong>
          <p>{{ interviewStageLabels[interview.round] }} · {{ interviewModeLabels[interview.mode] }} · {{ formatDateTime(interview.scheduledAt) }}</p>
        </div>
        <StatusBadge :result="interview.result" />
      </header>
      <p v-if="interview.feedback" class="feedback">{{ interview.feedback }}</p>
      <p v-else class="feedback muted">等待反馈记录</p>
    </div>
  </article>
</template>

<style scoped>
.timeline-node {
  position: relative;
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: 14px;
  padding: 10px 0 20px;
}

.timeline-node::before {
  position: absolute;
  top: 54px;
  bottom: 0;
  left: 22px;
  width: 1px;
  content: '';
  background: var(--line-soft);
}

.timeline-dot {
  z-index: 1;
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  overflow: hidden;
  color: var(--brand-contrast);
  font-weight: 800;
  background: var(--brand);
  border: 3px solid var(--app-bg);
  border-radius: 999px;
}

.timeline-dot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.timeline-content {
  padding: 14px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-md);
  background: var(--panel-bg);
}

.timeline-content header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.node-title {
  color: var(--text-strong);
  font-size: 16px;
  font-weight: 800;
}

.timeline-content p {
  margin: 4px 0 0;
  color: var(--text-muted);
  font-size: 13px;
}

.feedback {
  margin-top: 12px;
  color: var(--text-main);
  line-height: 1.6;
}

.feedback.muted {
  color: var(--text-muted);
}
</style>
