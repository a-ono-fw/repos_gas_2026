<script setup lang="ts">
import { ref } from 'vue';
import type { Todo, UpdateTodoInput } from '../types/todo.ts';

const props = defineProps<{
  todo: Todo;
  updating: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-completed', id: number, currentCompleted: boolean): void;
  (e: 'update-todo', id: number, updates: UpdateTodoInput): void;
  (e: 'delete-todo', id: number): void;
}>();

const isEditing = ref(false);
const editTitle = ref(props.todo.title);
const editDescription = ref(props.todo.description);
const showDeleteConfirm = ref(false);

const startEdit = () => {
  editTitle.value = props.todo.title;
  editDescription.value = props.todo.description;
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  editTitle.value = props.todo.title;
  editDescription.value = props.todo.description;
};

const saveEdit = () => {
  const trimmed = editTitle.value.trim();
  if (!trimmed) return;
  emit('update-todo', props.todo.id, {
    title: trimmed,
    description: editDescription.value.trim()
  });
  isEditing.value = false;
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
};
</script>

<template>
  <div
    class="bg-white border rounded-lg p-4 transition-all duration-150"
    :class="[
      todo.completed ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200 shadow-2xs hover:border-slate-300',
      isEditing ? 'ring-2 ring-slate-400 bg-white' : ''
    ]"
  >
    <!-- View Mode -->
    <div v-if="!isEditing" class="flex items-start gap-3.5">
      <!-- Complete Checkbox -->
      <button
        type="button"
        @click="emit('toggle-completed', todo.id, !todo.completed)"
        :disabled="updating"
        class="mt-1 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer"
        :class="todo.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-slate-500 bg-white'"
        aria-label="Toggle completed"
      >
        <svg v-if="todo.completed" class="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3">
          <h4
            class="text-sm font-medium leading-snug transition-colors break-words"
            :class="todo.completed ? 'line-through text-slate-400' : 'text-slate-900'"
          >
            {{ todo.title }}
          </h4>

          <!-- Row Action Controls -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              @click="startEdit"
              :disabled="updating"
              class="text-xs text-slate-500 hover:text-slate-900 font-medium px-2 py-1 rounded-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              編集
            </button>
            <button
              v-if="!showDeleteConfirm"
              type="button"
              @click="showDeleteConfirm = true"
              :disabled="updating"
              class="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded-sm hover:bg-rose-50 transition-colors cursor-pointer"
            >
              削除
            </button>

            <!-- Inline Delete Confirmation -->
            <div v-else class="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2 py-1 rounded-md text-xs">
              <span class="text-rose-700 font-medium">削除しますか?</span>
              <button
                type="button"
                @click="emit('delete-todo', todo.id); showDeleteConfirm = false"
                class="bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-sm font-medium transition-colors cursor-pointer"
              >
                はい
              </button>
              <button
                type="button"
                @click="showDeleteConfirm = false"
                class="text-slate-600 hover:text-slate-900 px-1 py-0.5 rounded-sm cursor-pointer"
              >
                いいえ
              </button>
            </div>
          </div>
        </div>

        <p v-if="todo.description" class="text-xs text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
          {{ todo.description }}
        </p>

        <!-- Unboxed Metadata with Typographic Separator -->
        <div class="flex items-center gap-2 text-xs text-slate-400 mt-2 font-mono">
          <span class="tabular-nums">#{{ todo.id }}</span>
          <span aria-hidden="true">·</span>
          <span class="tabular-nums">{{ formatDate(todo.created_at) }}</span>
          <span v-if="todo.updated_at && todo.updated_at !== todo.created_at" class="text-slate-400">
            (更新: {{ formatDate(todo.updated_at) }})
          </span>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="space-y-3">
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-slate-700">タイトル</label>
        <input
          v-model="editTitle"
          type="text"
          class="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-hidden focus:border-slate-500"
          placeholder="TODOタイトル"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-semibold text-slate-700">詳細・メモ</label>
        <textarea
          v-model="editDescription"
          rows="2"
          class="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-slate-500"
          placeholder="詳細内容を入力"
        ></textarea>
      </div>

      <div class="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          @click="cancelEdit"
          class="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
        >
          キャンセル
        </button>
        <button
          type="button"
          @click="saveEdit"
          :disabled="!editTitle.trim()"
          class="px-3.5 py-1.5 text-xs bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 rounded-md font-medium transition-colors cursor-pointer"
        >
          変更を保存
        </button>
      </div>
    </div>
  </div>
</template>
