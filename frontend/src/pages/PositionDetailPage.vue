<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import JobCard from '@/components/common/JobCard.vue';
import InterviewStage from '@/components/common/InterviewStage.vue';
import { useCompanyStore } from '@/stores/company';
import { useInterviewStore } from '@/stores/interview';
import { usePositionStore } from '@/stores/position';
import { useReflectionStore } from '@/stores/reflection';
import { InterviewMode, InterviewResult, InterviewStage as InterviewStageEnum, interviewModeLabels, interviewResultLabels, interviewStageLabels, stageRank } from '@/types/enums';
import type { InterviewDraft } from '@/types/interview';
import type { PositionDraft } from '@/types/position';
import type { ReflectionDraft } from '@/types/reflection';
import { fromDateTimeInputValue, toDateTimeInputValue } from '@/utils/format';

const route = useRoute();
const companyStore = useCompanyStore();
const positionStore = usePositionStore();
const interviewStore = useInterviewStore();
const reflectionStore = useReflectionStore();
const isInterviewDrawerOpen = ref(false);

const positionId = computed(() => String(route.params.id));
const position = computed(() => positionStore.findPosition(positionId.value));
const company = computed(() => (position.value ? companyStore.findCompany(position.value.companyId) : undefined));
const interviews = computed(() => interviewStore.byPosition(positionId.value));

const positionForm = reactive<PositionDraft>({
  title: '',
  companyId: '',
  salaryRange: '',
  location: '',
  jd: '',
  source: '',
  appliedDate: '',
  stage: InterviewStageEnum.Applied
});

const interviewDraft = reactive({
  round: InterviewStageEnum.FirstRound,
  result: InterviewResult.Pending,
  scheduledAt: toDateTimeInputValue(new Date().toISOString()),
  interviewer: '',
  mode: InterviewMode.Video,
  feedback: '',
  notes: '<p></p>'
});

const companyOptions = computed(() =>
  companyStore.sortedCompanies.map((item) => ({
    label: item.name,
    value: item.id
  }))
);

const stageOptions = Object.values(InterviewStageEnum).map((stage) => ({
  label: interviewStageLabels[stage],
  value: stage
}));

const roundOptions = Object.values(InterviewStageEnum)
  .filter((stage) => stage !== InterviewStageEnum.Applied)
  .map((stage) => ({
    label: interviewStageLabels[stage],
    value: stage
  }));

const resultOptions = Object.values(InterviewResult).map((result) => ({
  label: interviewResultLabels[result],
  value: result
}));

const modeOptions = Object.values(InterviewMode).map((mode) => ({
  label: interviewModeLabels[mode],
  value: mode
}));

function syncPositionForm(): void {
  if (!position.value) {
    return;
  }

  Object.assign(positionForm, {
    title: position.value.title,
    companyId: position.value.companyId,
    salaryRange: position.value.salaryRange,
    location: position.value.location,
    jd: position.value.jd,
    source: position.value.source,
    appliedDate: position.value.appliedDate,
    stage: position.value.stage
  });
}

function savePosition(): void {
  if (!position.value) {
    return;
  }

  positionStore.updatePosition(position.value.id, { ...positionForm });
}

function openInterviewDrawer(): void {
  Object.assign(interviewDraft, {
    round: InterviewStageEnum.FirstRound,
    result: InterviewResult.Pending,
    scheduledAt: toDateTimeInputValue(new Date().toISOString()),
    interviewer: '',
    mode: InterviewMode.Video,
    feedback: '',
    notes: '<p></p>'
  });
  isInterviewDrawerOpen.value = true;
}

function createInterview(): void {
  if (!position.value) {
    return;
  }

  const draft: InterviewDraft = {
    ...interviewDraft,
    positionId: position.value.id,
    scheduledAt: fromDateTimeInputValue(interviewDraft.scheduledAt)
  };
  interviewStore.addInterview(draft);

  if (stageRank[draft.round] > stageRank[position.value.stage]) {
    positionStore.updateStage(position.value.id, draft.round);
  }

  isInterviewDrawerOpen.value = false;
}

function updateInterview(id: string, patch: Partial<InterviewDraft>): void {
  interviewStore.updateInterview(id, patch);

  if (position.value && patch.round && stageRank[patch.round] > stageRank[position.value.stage]) {
    positionStore.updateStage(position.value.id, patch.round);
  }
}

function saveReflection(interviewId: string, draft: Omit<ReflectionDraft, 'interviewId'>): void {
  reflectionStore.upsertReflection(interviewId, draft);
}

watch(position, syncPositionForm, { immediate: true });
</script>

<template>
  <section v-if="position" class="page detail-page">
    <header class="page-header">
      <div>
        <p class="page-kicker">POSITION DETAIL</p>
        <h1 class="page-title">{{ position.title }}</h1>
        <p class="page-subtitle">{{ company?.name ?? '未关联公司' }} · {{ position.location }} · {{ position.salaryRange }}</p>
      </div>
      <n-button type="primary" @click="openInterviewDrawer">新增面试</n-button>
    </header>

    <div class="detail-grid">
      <main class="detail-main">
        <section class="surface position-editor">
          <header>
            <h2>职位信息</h2>
            <n-button secondary type="primary" @click="savePosition">保存职位</n-button>
          </header>
          <n-form label-placement="top">
            <n-grid :cols="2" :x-gap="14" :y-gap="8" responsive="screen">
              <n-form-item-gi label="职位名称">
                <n-input v-model:value="positionForm.title" />
              </n-form-item-gi>
              <n-form-item-gi label="所属公司">
                <n-select v-model:value="positionForm.companyId" :options="companyOptions" />
              </n-form-item-gi>
              <n-form-item-gi label="薪资范围">
                <n-input v-model:value="positionForm.salaryRange" />
              </n-form-item-gi>
              <n-form-item-gi label="工作地点">
                <n-input v-model:value="positionForm.location" />
              </n-form-item-gi>
              <n-form-item-gi label="投递渠道">
                <n-input v-model:value="positionForm.source" />
              </n-form-item-gi>
              <n-form-item-gi label="投递日期">
                <n-input v-model:value="positionForm.appliedDate" type="date" />
              </n-form-item-gi>
              <n-form-item-gi label="看板阶段">
                <n-select v-model:value="positionForm.stage" :options="stageOptions" />
              </n-form-item-gi>
            </n-grid>
            <n-form-item label="JD 内容">
              <n-input v-model:value="positionForm.jd" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" />
            </n-form-item>
          </n-form>
        </section>

        <section class="stage-list">
          <header class="section-heading">
            <h2>面试轮次</h2>
            <p>{{ interviews.length }} 条记录</p>
          </header>

          <InterviewStage
            v-for="interview in interviews"
            :key="interview.id"
            :interview="interview"
            :reflection="reflectionStore.byInterview(interview.id)"
            @update-interview="updateInterview"
            @save-reflection="saveReflection"
          />

          <div v-if="interviews.length === 0" class="empty-state">还没有面试记录</div>
        </section>
      </main>

      <aside class="detail-aside">
        <JobCard :position="position" :company="company" :interviews="interviews" compact />
        <section class="surface company-panel">
          <h2>公司备注</h2>
          <p>{{ company?.notes || '暂无公司备注' }}</p>
        </section>
      </aside>
    </div>

    <n-drawer v-model:show="isInterviewDrawerOpen" width="460">
      <n-drawer-content title="新增面试" closable>
        <n-form label-placement="top">
          <n-form-item label="轮次">
            <n-select v-model:value="interviewDraft.round" :options="roundOptions" />
          </n-form-item>
          <n-grid :cols="2" :x-gap="12" responsive="screen">
            <n-form-item-gi label="状态">
              <n-select v-model:value="interviewDraft.result" :options="resultOptions" />
            </n-form-item-gi>
            <n-form-item-gi label="方式">
              <n-select v-model:value="interviewDraft.mode" :options="modeOptions" />
            </n-form-item-gi>
          </n-grid>
          <n-form-item label="面试时间">
            <n-input v-model:value="interviewDraft.scheduledAt" type="datetime-local" />
          </n-form-item>
          <n-form-item label="面试官">
            <n-input v-model:value="interviewDraft.interviewer" />
          </n-form-item>
          <n-form-item label="反馈">
            <n-input v-model:value="interviewDraft.feedback" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button @click="isInterviewDrawerOpen = false">取消</n-button>
            <n-button type="primary" @click="createInterview">保存</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </section>

  <section v-else class="page">
    <n-result status="404" title="没有找到职位" description="该职位可能已被删除。">
      <template #footer>
        <n-button tag="a" href="/board">返回看板</n-button>
      </template>
    </n-result>
  </section>
</template>

<style scoped>
.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 18px;
  align-items: start;
}

.detail-main,
.stage-list {
  display: grid;
  gap: 16px;
}

.position-editor {
  padding: 18px;
}

.position-editor > header,
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.position-editor h2,
.section-heading h2,
.company-panel h2 {
  margin: 0;
  color: var(--text-strong);
  font-size: 20px;
}

.section-heading p {
  margin: 0;
  color: var(--text-muted);
}

.detail-aside {
  position: sticky;
  top: 24px;
  display: grid;
  gap: 14px;
}

.company-panel {
  padding: 16px;
}

.company-panel p {
  margin: 10px 0 0;
  color: var(--text-muted);
  line-height: 1.65;
}

@media (max-width: 1040px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-aside {
    position: static;
    order: -1;
  }
}
</style>
