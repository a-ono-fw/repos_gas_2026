<script setup lang="ts">
defineProps<{
  activeTab?: 'todos' | 'architecture' | 'api';
  dbStatus: {
    connected: boolean;
    type: string;
    totalTodos: number;
  };
}>();

const emit = defineEmits<{
  (e: 'change-tab', tab: 'todos' | 'architecture' | 'api'): void;
}>();
</script>

<template>
  <header class="border-b border-slate-200 bg-white sticky top-0 z-20">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Zone 1: Clickable Brand Title to return home/todos -->
      <button
        type="button"
        @click="emit('change-tab', 'todos')"
        class="flex items-center gap-3 text-left group cursor-pointer transition-opacity hover:opacity-90"
        title="TODOリストに戻る"
      >
        <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
          V
        </div>
        <div class="flex flex-col">
          <span class="text-base font-semibold tracking-tight text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">
            Vue & Node TODO
          </span>
          <span class="text-xs text-slate-500 font-mono mt-0.5">
            Full-Stack Starter
          </span>
        </div>
      </button>

      <!-- Zone 2: Database & Node.js Status Indicator -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5">
          <span
            class="w-2 h-2 rounded-full shrink-0"
            :class="dbStatus.connected ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-rose-500'"
          ></span>
          <span class="hidden sm:inline text-slate-700 font-medium">SQLite DB</span>
          <span class="text-slate-400">·</span>
          <span class="tabular-nums font-semibold text-slate-800">{{ dbStatus.totalTodos }} 件</span>
        </div>
      </div>
    </div>
  </header>
</template>
