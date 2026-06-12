<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import StatusBadge from './StatusBadge.vue';
import type { Company } from '@/types/company';
import type { Interview } from '@/types/interview';
import type { Position } from '@/types/position';
import { formatDate, formatDateTime } from '@/utils/format';

const props = defineProps<{
  position: Position;
  company?: Company;
  interviews?: Interview[];
  compact?: boolean;
}>();

const sortedInterviews = computed(() =>
  [...(props.interviews ?? [])].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
);

const latestInterview = computed(() => sortedInterviews.value[0]);
const nextInterview = computed(() =>
  [...(props.interviews ?? [])]
    .filter((interview) => new Date(interview.scheduledAt).getTime() >= Date.now())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0]
);

const companyInitial = computed(() => props.company?.name.slice(0, 1) ?? '?');
</script>

<template>
  <RouterLink class="job-card" :class="{ compact }" :to="`/positions/${position.id}`">
    <header class="job-card-header">
      <span class="logo" aria-hidden="true">
        <img v-if="company?.logoUrl" :src="company.logoUrl" :alt="company.name" />
        <span v-else>{{ companyInitial }}</span>
      </span>
      <span class="company-block">
        <strong>{{ position.title }}</strong>
        <small>{{ company?.name ?? '未关联公司' }} · {{ position.location }}</small>
      </span>
    </header>

    <p v-if="!compact" class="job-summary">{{ position.jd }}</p>

    <div class="job-meta">
      <StatusBadge :stage="position.stage" />
      <StatusBadge v-if="latestInterview" :result="latestInterview.result" />
    </div>

    <footer class="job-card-footer">
      <span>{{ position.salaryRange }}</span>
      <span v-if="nextInterview">下一场 {{ formatDateTime(nextInterview.scheduledAt) }}</span>
      <span v-else>投递 {{ formatDate(position.appliedDate) }}</span>
    </footer>
  </RouterLink>
</template>

<style scoped>
.job-card {
  display: grid;
  gap: 12px;
  padding: 14px;
  color: var(--text-main);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-md);
  background: var(--panel-bg);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.job-card:hover {
  transform: translateY(-2px);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-soft);
}

.job-card.compact {
  box-shadow: none;
}

.job-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.logo {
  display: grid;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  place-items: center;
  overflow: hidden;
  color: var(--brand-contrast);
  font-weight: 800;
  background: var(--brand);
  border-radius: var(--radius-sm);
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-block {
  min-width: 0;
}

.company-block strong,
.company-block small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.company-block strong {
  color: var(--text-strong);
  font-size: 15px;
}

.company-block small {
  margin-top: 3px;
  color: var(--text-muted);
  font-size: 12px;
}

.job-summary {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.job-card-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--text-muted);
  font-size: 12px;
}
</style>
