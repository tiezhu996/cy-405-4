<script setup lang="ts">
import { computed } from 'vue';
import FunnelChart from '@/components/charts/FunnelChart.vue';
import HeatMap from '@/components/charts/HeatMap.vue';
import PieBreakdown from '@/components/charts/PieBreakdown.vue';
import { useFunnelData } from '@/hooks/useFunnelData';
import { useCompanyStore } from '@/stores/company';
import { useInterviewStore } from '@/stores/interview';
import { usePositionStore } from '@/stores/position';
import { buildCompanyPie, buildHeatMapData, buildIndustryPie } from '@/utils/chart-helpers';

const companyStore = useCompanyStore();
const positionStore = usePositionStore();
const interviewStore = useInterviewStore();

const positions = computed(() => positionStore.positions);
const interviews = computed(() => interviewStore.interviews);
const companies = computed(() => companyStore.companies);

const funnel = useFunnelData(positions, interviews);
const heatMapData = computed(() => buildHeatMapData(interviews.value));
const companyPie = computed(() => buildCompanyPie(positions.value, companies.value));
const industryPie = computed(() => buildIndustryPie(positions.value, companies.value));
const funnelData = funnel.data;
const offerRate = funnel.offerRate;

const passedInterviews = computed(() => interviews.value.filter((interview) => interview.result === 'passed').length);
const totalInterviews = computed(() => interviews.value.length);
</script>

<template>
  <section class="page stats-page">
    <header class="page-header">
      <div>
        <p class="page-kicker">ANALYTICS</p>
        <h1 class="page-title">把感觉变成可复盘的数据</h1>
        <p class="page-subtitle">漏斗、时间热力和公司/行业分布会随本地数据实时更新。</p>
      </div>
    </header>

    <div class="metric-strip">
      <div class="metric">
        <strong>{{ offerRate }}%</strong>
        <span>Offer 转化率</span>
      </div>
      <div class="metric">
        <strong>{{ totalInterviews }}</strong>
        <span>面试总场次</span>
      </div>
      <div class="metric">
        <strong>{{ passedInterviews }}</strong>
        <span>已通过轮次</span>
      </div>
    </div>

    <div class="chart-grid">
      <section class="chart-panel surface wide">
        <header>
          <h2>投递 → 一面 → 二面 → Offer</h2>
          <p>每个阶段按已达到该阶段的职位数计算。</p>
        </header>
        <FunnelChart :data="funnelData" />
      </section>

      <section class="chart-panel surface wide">
        <header>
          <h2>面试时间分布</h2>
          <p>按星期与小时统计所有已记录面试。</p>
        </header>
        <HeatMap :data="heatMapData" />
      </section>

      <section class="chart-panel surface">
        <PieBreakdown id="company-pie" title="公司投递分布" :data="companyPie" />
      </section>

      <section class="chart-panel surface">
        <PieBreakdown id="industry-pie" title="行业投递分布" :data="industryPie" />
      </section>
    </div>
  </section>
</template>

<style scoped>
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.chart-panel {
  padding: 18px;
}

.chart-panel.wide {
  grid-column: 1 / -1;
}

.chart-panel header {
  margin-bottom: 8px;
}

.chart-panel h2,
.chart-panel p {
  margin: 0;
}

.chart-panel h2 {
  color: var(--text-strong);
  font-size: 20px;
}

.chart-panel p {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 13px;
}

@media (max-width: 900px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style>
