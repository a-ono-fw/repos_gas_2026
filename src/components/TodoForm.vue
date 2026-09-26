<script setup lang="ts">
import { ref } from 'vue';
import type { CreateTodoInput } from '../types/todo.ts';

const emit = defineEmits<{
  (e: 'create-todo', input: CreateTodoInput): void;
}>();

const props = defineProps<{
  submitting: boolean;
}>();

const title = ref('');
const description = ref('');
const showDetails = ref(false);
const errorMsg = ref('');

const handleSubmit = () => {
  errorMsg.value = '';
  const trimmedTitle = title.value.trim();
  if (!trimmedTitle) {
    errorMsg.value = 'タイトルを入力してください';
    return;
  }

  emit('create-todo', {
    title: trimmedTitle,
    description: description.value.trim(),
    completed: 0
  });

  title.value = '';
  description.value = '';
  showDetails.value = false;
};
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs transition-all">
    <form @submit.prevent="handleSubmit" class="space-y-3">
      <div>
        <div class="flex items-center gap-2">
          <input
            v-model="title"
            type="text"
            placeholder="新しいTODOを入力... (例: バックエンドAPIの動作確認)"
            class="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-colors"
            :disabled="submitting"
          />
          <button
            type="submit"
            :disabled="submitting || !title.trim()"
            class="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
          >
            <span v-if="submitting">追加中...</span>
            <span v-else>TODOを追加</span>
          </button>
        </div>
        <p v-if="errorMsg" class="text-xs text-rose-600 mt-1.5 font-medium">
          {{ errorMsg }}
        </p>
      </div>

      <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
        <button
          type="button"
          @click="showDetails = !showDetails"
          class="hover:text-slate-800 underline underline-offset-2 transition-colors cursor-pointer"
        >
          {{ showDetails ? '▲ 詳細メモを閉じる' : '▼ 詳細メモ・説明を追加' }}
        </button>
        <span class="text-slate-400">Enterキーでも登録できます</span>
      </div>

      <div v-if="showDetails" class="pt-2 border-t border-slate-100">
        <textarea
          v-model="description"
          rows="2"
          placeholder="詳細メモや補足情報 (任意)"
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-colors"
          :disabled="submitting"
        ></textarea>
      </div>
    </form>
  </div>
</template>
