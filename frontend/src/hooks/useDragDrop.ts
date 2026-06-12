import { ref } from 'vue';
import type { InterviewStage } from '@/types/enums';

interface DragChangeEvent<T> {
  added?: {
    element: T;
  };
  moved?: {
    element: T;
  };
}

interface DragDropOptions<T> {
  onMove: (item: T, targetStage: InterviewStage) => void;
}

export function useDragDrop<T extends { id: string; stage: InterviewStage }>(options: DragDropOptions<T>) {
  const draggingId = ref<string | null>(null);

  function handleChoose(event: { item?: { __draggable_context?: { element?: T } } }): void {
    draggingId.value = event.item?.__draggable_context?.element?.id ?? null;
  }

  function handleChange(targetStage: InterviewStage, event: DragChangeEvent<T>): void {
    const item = event.added?.element ?? event.moved?.element;
    if (item && item.stage !== targetStage) {
      options.onMove(item, targetStage);
    }
  }

  function handleEnd(): void {
    draggingId.value = null;
  }

  return {
    draggingId,
    handleChoose,
    handleChange,
    handleEnd
  };
}
