<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import NoteEditor from './NoteEditor.vue';
import StatusBadge from './StatusBadge.vue';
import { InterviewMode, InterviewResult, InterviewStage as InterviewStageEnum, interviewModeLabels, interviewResultLabels, interviewStageLabels } from '@/types/enums';
import type { Interview, InterviewDraft } from '@/types/interview';
import type { Reflection, ReflectionDraft, ReflectionQuestion } from '@/types/reflection';
import { createId, fromDateTimeInputValue, toDateTimeInputValue } from '@/utils/format';

const props = defineProps<{
  interview: Interview;
  reflection?: Reflection;
}>();

const emit = defineEmits<{
  updateInterview: [id: string, patch: Partial<InterviewDraft>];
  saveReflection: [interviewId: string, draft: Omit<ReflectionDraft, 'interviewId'>];
}>();

const interviewForm = reactive({
  result: InterviewResult.Pending,
  scheduledAt: '',
  interviewer: '',
  mode: InterviewMode.Video,
  feedback: '',
  notes: ''
});

const reflectionForm = reactive({
  overallFeeling: '',
  improvements: ''
});

const questionRows = ref<ReflectionQuestion[]>([]);

const resultOptions = Object.values(InterviewResult).map((value) => ({
  label: interviewResultLabels[value],
  value
}));

const modeOptions = Object.values(InterviewMode).map((value) => ({
  label: interviewModeLabels[value],
  value
}));

function defaultQuestion(): ReflectionQuestion {
  return {
    id: createId('question'),
    question: '',
    answer: '',
    score: 3
  };
}

function syncInterview(): void {
  interviewForm.result = props.interview.result;
  interviewForm.scheduledAt = toDateTimeInputValue(props.interview.scheduledAt);
  interviewForm.interviewer = props.interview.interviewer;
  interviewForm.mode = props.interview.mode;
  interviewForm.feedback = props.interview.feedback;
  interviewForm.notes = props.interview.notes;
}

function syncReflection(): void {
  reflectionForm.overallFeeling = props.reflection?.overallFeeling ?? '';
  reflectionForm.improvements = props.reflection?.improvements ?? '';
  questionRows.value = props.reflection?.questions.length
    ? props.reflection.questions.map((question) => ({ ...question }))
    : [defaultQuestion()];
}

function addQuestion(): void {
  questionRows.value.push(defaultQuestion());
}

function removeQuestion(id: string): void {
  questionRows.value = questionRows.value.length > 1 ? questionRows.value.filter((question) => question.id !== id) : [defaultQuestion()];
}

function saveInterview(): void {
  emit('updateInterview', props.interview.id, {
    result: interviewForm.result,
    scheduledAt: fromDateTimeInputValue(interviewForm.scheduledAt),
    interviewer: interviewForm.interviewer,
    mode: interviewForm.mode,
    feedback: interviewForm.feedback,
    notes: interviewForm.notes,
    round: props.interview.round,
    positionId: props.interview.positionId
  });
}

function saveReflection(): void {
  emit('saveReflection', props.interview.id, {
    questions: questionRows.value,
    overallFeeling: reflectionForm.overallFeeling,
    improvements: reflectionForm.improvements
  });
}

watch(() => props.interview, syncInterview, { immediate: true, deep: true });
watch(() => props.reflection, syncReflection, { immediate: true, deep: true });
</script>

<template>
  <section class="interview-stage">
    <header class="stage-header">
      <div>
        <h3>{{ interviewStageLabels[interview.round] }}</h3>
        <p>{{ interview.interviewer || '未填写面试官' }}</p>
      </div>
      <StatusBadge :result="interview.result" />
    </header>

    <n-grid :cols="2" :x-gap="14" :y-gap="14" responsive="screen">
      <n-form-item-gi label="面试时间">
        <n-input v-model:value="interviewForm.scheduledAt" type="datetime-local" />
      </n-form-item-gi>
      <n-form-item-gi label="面试状态">
        <n-select v-model:value="interviewForm.result" :options="resultOptions" />
      </n-form-item-gi>
      <n-form-item-gi label="面试官">
        <n-input v-model:value="interviewForm.interviewer" placeholder="例如 技术负责人 / HRBP" />
      </n-form-item-gi>
      <n-form-item-gi label="面试方式">
        <n-select v-model:value="interviewForm.mode" :options="modeOptions" />
      </n-form-item-gi>
    </n-grid>

    <n-form-item label="反馈">
      <n-input v-model:value="interviewForm.feedback" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
    </n-form-item>

    <n-form-item label="富文本笔记">
      <NoteEditor v-model="interviewForm.notes" />
    </n-form-item>

    <div class="stage-actions">
      <n-button type="primary" @click="saveInterview">保存面试</n-button>
    </div>

    <div class="reflection-block">
      <h4>复盘记录</h4>
      <div class="question-list">
        <article v-for="question in questionRows" :key="question.id" class="question-row">
          <n-input v-model:value="question.question" placeholder="问题" />
          <n-input v-model:value="question.answer" type="textarea" placeholder="回答要点" :autosize="{ minRows: 2, maxRows: 5 }" />
          <div class="question-rating">
            <n-rate v-model:value="question.score" />
            <n-button size="small" secondary @click="removeQuestion(question.id)">删除</n-button>
          </div>
        </article>
      </div>
      <n-button secondary @click="addQuestion">添加问题</n-button>
      <n-grid :cols="2" :x-gap="14" :y-gap="14" responsive="screen" class="reflection-notes">
        <n-form-item-gi label="整体感受">
          <n-input v-model:value="reflectionForm.overallFeeling" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
        </n-form-item-gi>
        <n-form-item-gi label="改进点">
          <n-input v-model:value="reflectionForm.improvements" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
        </n-form-item-gi>
      </n-grid>
      <div class="stage-actions">
        <n-button type="primary" secondary @click="saveReflection">保存复盘</n-button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.interview-stage {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-md);
  background: var(--panel-bg);
}

.stage-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.stage-header h3 {
  margin: 0;
  color: var(--text-strong);
  font-size: 20px;
}

.stage-header p {
  margin: 6px 0 0;
  color: var(--text-muted);
}

.stage-actions {
  display: flex;
  justify-content: flex-end;
}

.reflection-block {
  display: grid;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--line-soft);
}

.reflection-block h4 {
  margin: 0;
  color: var(--text-strong);
  font-size: 16px;
}

.question-list {
  display: grid;
  gap: 10px;
}

.question-row {
  display: grid;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-md);
  background: var(--panel-muted);
}

.question-rating {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.reflection-notes {
  margin-top: 4px;
}
</style>
