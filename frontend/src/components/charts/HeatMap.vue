<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{
  data: [number, number, number][];
}>();

let chart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

const maxValue = computed(() => Math.max(1, ...props.data.map((item) => item[2])));
const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const hours = Array.from({ length: 24 }, (_, index) => `${index}:00`);

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function renderChart(): void {
  if (!chart) {
    return;
  }

  chart.setOption({
    tooltip: {
      position: 'top',
      formatter: (params: { value: [number, number, number] }) => {
        const [hour, day, count] = params.value;
        return `${weekdays[day]} ${hours[hour]}<br/>${count} 场面试`;
      }
    },
    grid: {
      left: 48,
      right: 18,
      top: 18,
      bottom: 36
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: true },
      axisLabel: { color: cssVar('--text-muted'), interval: 3 }
    },
    yAxis: {
      type: 'category',
      data: weekdays,
      splitArea: { show: true },
      axisLabel: { color: cssVar('--text-muted') }
    },
    visualMap: {
      min: 0,
      max: maxValue.value,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: [cssVar('--panel-muted'), cssVar('--accent-amber'), cssVar('--brand')]
      },
      textStyle: {
        color: cssVar('--text-muted')
      }
    },
    series: [
      {
        name: '时间分布',
        type: 'heatmap',
        data: props.data,
        label: {
          show: true,
          color: cssVar('--text-strong')
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.24)'
          }
        }
      }
    ]
  });
}

onMounted(() => {
  const el = document.getElementById('heat-map');
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
  <div id="heat-map" class="chart-box" />
</template>

<style scoped>
.chart-box {
  width: 100%;
  min-height: 320px;
}
</style>
