<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { FunnelPoint } from '@/utils/chart-helpers';

const props = defineProps<{
  data: FunnelPoint[];
}>();

let chart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function renderChart(): void {
  if (!chart) {
    return;
  }

  chart.setOption({
    color: [cssVar('--brand'), cssVar('--accent-blue'), cssVar('--accent-amber'), cssVar('--accent-green')],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    series: [
      {
        name: '面试漏斗',
        type: 'funnel',
        left: '4%',
        right: '8%',
        top: 22,
        bottom: 10,
        minSize: '28%',
        maxSize: '92%',
        sort: 'none',
        gap: 4,
        label: {
          color: cssVar('--text-strong'),
          formatter: (params: { data: { rate: number }; name: string }) => `${params.name} ${params.data.rate}%`
        },
        itemStyle: {
          borderColor: cssVar('--panel-bg'),
          borderWidth: 2
        },
        data: props.data.map((item) => ({
          name: item.name,
          value: item.value,
          rate: item.rate
        }))
      }
    ]
  });
}

onMounted(() => {
  const el = document.getElementById('funnel-chart');
  if (!el) {
    return;
  }

  chart = echarts.init(el);
  resizeObserver = new ResizeObserver(() => chart?.resize());
  resizeObserver.observe(el);
  renderChart();
});

watch(() => props.data, renderChart, { deep: true });

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});
</script>

<template>
  <div id="funnel-chart" class="chart-box" />
</template>

<style scoped>
.chart-box {
  width: 100%;
  min-height: 340px;
}
</style>
