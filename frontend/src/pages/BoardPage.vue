<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import Draggable from 'vuedraggable';
import BoardToolbar from '@/components/board/BoardToolbar.vue';
import JobCard from '@/components/common/JobCard.vue';
import KanbanColumn from '@/components/common/KanbanColumn.vue';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useCompanyStore } from '@/stores/company';
import { useInterviewStore } from '@/stores/interview';
import { usePositionStore } from '@/stores/position';
import { boardStages, InterviewStage, interviewStageLabels } from '@/types/enums';
import type { BoardStage } from '@/types/enums';
import type { Position, PositionDraft } from '@/types/position';

type DragChangeEvent = {
  added?: { element: Position };
  moved?: { element: Position };
};

const companyStore = useCompanyStore();
const positionStore = usePositionStore();
const interviewStore = useInterviewStore();
const search = ref('');
const isDrawerOpen = ref(false);

const stageBuckets = reactive<Record<BoardStage, Position[]>>({
  [InterviewStage.Applied]: [],
  [InterviewStage.FirstRound]: [],
  [InterviewStage.SecondRound]: [],
  [InterviewStage.ThirdRound]: [],
  [InterviewStage.Offer]: []
});

const draft = reactive<PositionDraft>({
  title: '',
  companyId: '',
  salaryRange: '',
  location: '',
  jd: '',
  source: '',
  appliedDate: new Date().toISOString().slice(0, 10),
  stage: InterviewStage.Applied
});

const columnDescriptions: Record<BoardStage, string> = {
  [InterviewStage.Applied]: '刚投递或等待邀约',
  [InterviewStage.FirstRound]: '技术初筛与一面',
  [InterviewStage.SecondRound]: '深入技术或业务面',
  [InterviewStage.ThirdRound]: '终轮前关键沟通',
  [InterviewStage.Offer]: '谈薪与入职决策'
};

const companyOptions = computed(() =>
  companyStore.sortedCompanies.map((company) => ({
    label: company.name,
    value: company.id
  }))
);

const filteredPositions = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  if (!keyword) {
    return positionStore.positions;
  }

  return positionStore.positions.filter((position) => {
    const company = companyStore.findCompany(position.companyId);
    return [position.title, position.location, position.jd, position.source, company?.name ?? '']
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });
});

const totalPositions = computed(() => positionStore.positions.length);
const upcomingInterviews = computed(
  () => interviewStore.interviews.filter((interview) => new Date(interview.scheduledAt).getTime() >= Date.now()).length
);
const offerCount = computed(() => positionStore.positions.filter((position) => position.stage === InterviewStage.Offer).length);

const dragDrop = useDragDrop<Position>({
  onMove(position, targetStage) {
    positionStore.updateStage(position.id, targetStage);
  }
});

function rebuildBuckets(): void {
  boardStages.forEach((stage) => {
    stageBuckets[stage] = filteredPositions.value.filter((position) => position.stage === stage);
  });
}

function openCreateDrawer(): void {
  Object.assign(draft, {
    title: '',
    companyId: companyOptions.value[0]?.value ?? '',
    salaryRange: '',
    location: '',
    jd: '',
    source: '',
    appliedDate: new Date().toISOString().slice(0, 10),
    stage: InterviewStage.Applied
  });
  isDrawerOpen.value = true;
}

function createPosition(): void {
  if (!draft.title || !draft.companyId) {
    return;
  }

  positionStore.addPosition({ ...draft });
  isDrawerOpen.value = false;
}

function handleDragChange(stage: BoardStage, event: DragChangeEvent): void {
  dragDrop.handleChange(stage, event);
  rebuildBuckets();
}

watch(filteredPositions, rebuildBuckets, { immediate: true, deep: true });
</script>

<template>
  <section class="page board-page">
    <header class="page-header">
      <div>
        <p class="page-kicker">PIPELINE BOARD</p>
        <h1 class="page-title">把每个机会停在正确的阶段</h1>
        <p class="page-subtitle">拖动职位卡即可更新进度；所有公司、职位、面试数据会自动保存到浏览器本地。</p>
      </div>
    </header>

    <div class="metric-strip">
      <div class="metric">
        <strong>{{ totalPositions }}</strong>
        <span>投递职位</span>
      </div>
      <div class="metric">
        <strong>{{ upcomingInterviews }}</strong>
        <span>待处理面试</span>
      </div>
      <div class="metric">
        <strong>{{ offerCount }}</strong>
        <span>Offer 阶段</span>
      </div>
    </div>

    <BoardToolbar v-model="search" @create="openCreateDrawer" />

    <div class="kanban-board">
      <KanbanColumn
        v-for="stage in boardStages"
        :key="stage"
        :stage="stage"
        :title="interviewStageLabels[stage]"
        :description="columnDescriptions[stage]"
        :count="stageBuckets[stage].length"
      >
        <Draggable
          :list="stageBuckets[stage]"
          item-key="id"
          group="positions"
          class="card-stack"
          ghost-class="drag-ghost"
          :animation="180"
          @choose="dragDrop.handleChoose"
          @end="dragDrop.handleEnd"
          @change="(event: DragChangeEvent) => handleDragChange(stage, event)"
        >
          <template #item="{ element }">
            <JobCard
              :position="element"
              :company="companyStore.findCompany(element.companyId)"
              :interviews="interviewStore.byPosition(element.id)"
            />
          </template>
          <template #footer>
            <div v-if="stageBuckets[stage].length === 0" class="empty-state">暂无职位</div>
          </template>
        </Draggable>
      </KanbanColumn>
    </div>

    <n-drawer v-model:show="isDrawerOpen" width="460">
      <n-drawer-content title="新建职位" closable>
        <n-form label-placement="top">
          <n-form-item label="职位名称">
            <n-input v-model:value="draft.title" placeholder="例如 高级前端工程师" />
          </n-form-item>
          <n-form-item label="关联公司">
            <n-select v-model:value="draft.companyId" :options="companyOptions" placeholder="选择公司" />
          </n-form-item>
          <n-grid :cols="2" :x-gap="12" responsive="screen">
            <n-form-item-gi label="薪资范围">
              <n-input v-model:value="draft.salaryRange" placeholder="35k-45k * 14" />
            </n-form-item-gi>
            <n-form-item-gi label="工作地点">
              <n-input v-model:value="draft.location" placeholder="上海 / 远程" />
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="2" :x-gap="12" responsive="screen">
            <n-form-item-gi label="投递渠道">
              <n-input v-model:value="draft.source" placeholder="内推 / 猎头 / 官网" />
            </n-form-item-gi>
            <n-form-item-gi label="投递日期">
              <n-input v-model:value="draft.appliedDate" type="date" />
            </n-form-item-gi>
          </n-grid>
          <n-form-item label="JD 内容">
            <n-input v-model:value="draft.jd" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button @click="isDrawerOpen = false">取消</n-button>
            <n-button type="primary" :disabled="!draft.title || !draft.companyId" @click="createPosition">保存</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </section>
</template>

<style scoped>
.kanban-board {
  display: grid;
  grid-auto-columns: minmax(275px, 1fr);
  grid-auto-flow: column;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 12px;
}

.card-stack {
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 460px;
}

.drag-ghost {
  opacity: 0.35;
}
</style>
