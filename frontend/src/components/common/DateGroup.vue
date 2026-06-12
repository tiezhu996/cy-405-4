<script setup lang="ts">
defineProps<{
  date: string;
  count: number;
}>();
</script>

<template>
  <section class="date-group">
    <header class="date-group-header">
      <h2>{{ date }}</h2>
      <span>{{ count }} 场</span>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.date-group {
  margin-bottom: 20px;
}

.date-group-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0 12px;
  background: var(--app-bg);
}

.date-group-header h2 {
  margin: 0;
  color: var(--text-strong);
  font-size: 18px;
}

.date-group-header span {
  color: var(--text-muted);
  font-size: 13px;
}
</style>
