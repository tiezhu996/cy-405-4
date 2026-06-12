<script setup lang="ts">
import { computed } from 'vue';
import DateGroup from '@/components/common/DateGroup.vue';
import TimelineNode from '@/components/common/TimelineNode.vue';
import { useCompanyStore } from '@/stores/company';
import { useInterviewStore } from '@/stores/interview';
import { usePositionStore } from '@/stores/position';
import { formatDate } from '@/utils/format';

const companyStore = useCompanyStore();
const positionStore = usePositionStore();
const interviewStore = useInterviewStore();

const groups = computed(() => {
  const map = new Map<string, typeof interviewStore.sortedInterviews>();
  interviewStore.sortedInterviews.forEach((interview) => {
    const key = formatDate(interview.scheduledAt);
    map.set(key, [...(map.get(key) ?? []), interview]);
  });

  return Array.from(map.entries()).map(([date, interviews]) => ({ date, interviews }));
});

function companyForPosition(positionId: string) {
  const position = positionStore.findPosition(positionId);
  return position ? companyStore.findCompany(position.companyId) : undefined;
}
</script>

<template>
  <section class="page timeline-page">
    <header class="page-header">
      <div>
        <p class="page-kicker">TIMELINE</p>
        <h1 class="page-title">所有面试按时间回放</h1>
        <p class="page-subtitle">从最近的安排开始，回看每轮面试的时间、方式、反馈和下一步。</p>
      </div>
    </header>

    <div v-if="groups.length" class="timeline-wrap">
      <DateGroup v-for="group in groups" :key="group.date" :date="group.date" :count="group.interviews.length">
        <TimelineNode
          v-for="interview in group.interviews"
          :key="interview.id"
          :interview="interview"
          :position="positionStore.findPosition(interview.positionId)"
          :company="companyForPosition(interview.positionId)"
        />
      </DateGroup>
    </div>
    <div v-else class="empty-state">还没有面试事件</div>
  </section>
</template>

<style scoped>
.timeline-wrap {
  max-width: 920px;
}
</style>
