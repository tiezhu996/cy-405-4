<script setup lang="ts">
import { AddCircleOutline, SearchOutline } from '@vicons/ionicons5';

defineProps<{
  modelValue: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
  create: [];
}>();
</script>

<template>
  <div class="board-toolbar surface">
    <n-input
      :value="modelValue"
      clearable
      placeholder="搜索职位、地点、JD"
      @update:value="$emit('update:modelValue', $event)"
    >
      <template #prefix>
        <n-icon :component="SearchOutline" />
      </template>
    </n-input>
    <n-button type="primary" @click="$emit('create')">
      <template #icon>
        <n-icon :component="AddCircleOutline" />
      </template>
      新建职位
    </n-button>
  </div>
</template>

<style scoped>
.board-toolbar {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  gap: 12px;
  padding: 12px;
  margin-bottom: 18px;
}

@media (max-width: 620px) {
  .board-toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
