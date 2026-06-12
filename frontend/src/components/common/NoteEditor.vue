<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const editor = ref<HTMLElement | null>(null);

function syncEditor(value: string): void {
  if (editor.value && editor.value.innerHTML !== value) {
    editor.value.innerHTML = value;
  }
}

function emitContent(): void {
  emit('update:modelValue', editor.value?.innerHTML ?? '');
}

function runCommand(command: string): void {
  editor.value?.focus();
  document.execCommand(command, false);
  emitContent();
}

watch(
  () => props.modelValue,
  async (value) => {
    await nextTick();
    syncEditor(value);
  }
);

onMounted(() => {
  syncEditor(props.modelValue);
});
</script>

<template>
  <div class="note-editor">
    <div class="note-toolbar" aria-label="笔记格式工具">
      <n-button size="tiny" secondary @click="runCommand('bold')">B</n-button>
      <n-button size="tiny" secondary @click="runCommand('italic')">I</n-button>
      <n-button size="tiny" secondary @click="runCommand('insertUnorderedList')">列表</n-button>
    </div>
    <div
      ref="editor"
      class="note-input"
      contenteditable="true"
      role="textbox"
      aria-multiline="true"
      @input="emitContent"
    />
  </div>
</template>

<style scoped>
.note-editor {
  overflow: hidden;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-md);
  background: var(--panel-bg);
}

.note-toolbar {
  display: flex;
  gap: 6px;
  padding: 8px;
  border-bottom: 1px solid var(--line-soft);
  background: var(--panel-muted);
}

.note-input {
  min-height: 126px;
  padding: 12px;
  color: var(--text-main);
  line-height: 1.7;
  outline: none;
}

.note-input:focus {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--brand) 34%, transparent);
}
</style>
