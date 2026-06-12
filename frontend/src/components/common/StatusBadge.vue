<script setup lang="ts">
import { computed } from 'vue';
import { InterviewResult, InterviewStage, interviewResultLabels, interviewStageLabels } from '@/types/enums';

const props = defineProps<{
  result?: InterviewResult;
  stage?: InterviewStage;
}>();

const label = computed(() => {
  if (props.result) {
    return interviewResultLabels[props.result];
  }

  if (props.stage) {
    return interviewStageLabels[props.stage];
  }

  return '未设置';
});

const tone = computed(() => {
  if (props.result === InterviewResult.Passed || props.stage === InterviewStage.Offer) {
    return 'success';
  }

  if (props.result === InterviewResult.Rejected || props.result === InterviewResult.Withdrawn) {
    return 'danger';
  }

  if (props.stage === InterviewStage.FirstRound || props.stage === InterviewStage.SecondRound || props.stage === InterviewStage.ThirdRound) {
    return 'active';
  }

  return 'neutral';
});
</script>

<template>
  <span class="status-badge" :data-tone="tone">{{ label }}</span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  background: var(--panel-muted);
  white-space: nowrap;
}

.status-badge[data-tone='success'] {
  color: var(--accent-green);
  border-color: color-mix(in srgb, var(--accent-green) 38%, transparent);
  background: color-mix(in srgb, var(--accent-green) 12%, var(--panel-bg));
}

.status-badge[data-tone='active'] {
  color: var(--accent-blue);
  border-color: color-mix(in srgb, var(--accent-blue) 36%, transparent);
  background: color-mix(in srgb, var(--accent-blue) 10%, var(--panel-bg));
}

.status-badge[data-tone='danger'] {
  color: var(--accent-red);
  border-color: color-mix(in srgb, var(--accent-red) 36%, transparent);
  background: color-mix(in srgb, var(--accent-red) 10%, var(--panel-bg));
}
</style>
