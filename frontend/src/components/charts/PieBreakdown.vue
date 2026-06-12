<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { ChartPoint } from '@/utils/chart-helpers';

const props = defineProps<{
  id: string;
  title: string;
  data: ChartPoint[];
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
    color: [cssVar('--brand'), cssVar('--accent-blue'), cssVar('--accent-amber'), cssVar('--accent-green'), cssVar('--accent-red')],
    title: {
      text: props.title,
      left: 12,
      top: 4,
      textStyle: {
        color: cssVar('--text-strong'),
        fontSize: 15
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: cssVar('--text-muted')
      }
    },
    series: [
      {
        name: props.title,
        type: 'pie',
        radius: ['38%', '68%'],
        center: ['50%', '48%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: cssVar('--panel-bg'),
          borderWidth: 2
        },
        label: {
          color: cssVar('--text-main')
        },
        data: props.data
      }
    ]
  });
}

onMounted(() => {
  const el = document.getElementById(props.id);
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
  <div :id="id" class="chart-box" />
</template>

<style scoped>
.chart-box {
  width: 100%;
  min-height: 300px;
}
</style>
