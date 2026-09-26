<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Todo, CreateTodoInput, UpdateTodoInput } from './types/todo.ts';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  toggleTodoCompleted,
  deleteTodo,
  checkHealth
} from './services/api.ts';
import AppHeader from './components/AppHeader.vue';
import TodoForm from './components/TodoForm.vue';
import TodoItem from './components/TodoItem.vue';
import ArchitectureGuide from './components/ArchitectureGuide.vue';
import ApiReference from './components/ApiReference.vue';

const todos = ref<Todo[]>([]);
const loading = ref(true);
const submitting = ref(false);
const updatingId = ref<number | null>(null);
const errorMessage = ref('');
const filter = ref<'all' | 'pending' | 'completed'>('all');
const searchQuery = ref('');
const activeTab = ref<'todos' | 'architecture' | 'api'>('todos');

const dbStatus = ref({
  connected: false,
  type: 'SQLite (sql.js)',
  totalTodos: 0,
});

const loadData = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const [fetchedTodos, health] = await Promise.all([
      fetchTodos(),
      checkHealth().catch(() => null)
    ]);
    todos.value = fetchedTodos;
    dbStatus.value = {
      connected: !!health,
      type: health?.database || 'SQLite (sql.js)',
      totalTodos: fetchedTodos.length,
    };
  } catch (err: any) {
    errorMessage.value = err.message || 'TODOリストの取得に失敗しました';
    dbStatus.value.connected = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

const totalCount = computed(() => todos.value.length);
const completedCount = computed(() => todos.value.filter(t => t.completed === 1).length);
const pendingCount = computed(() => todos.value.filter(t => t.completed === 0).length);
const completionPercentage = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((completedCount.value / totalCount.value) * 100);
});

const filteredTodos = computed(() => {
  let list = todos.value;
  if (filter.value === 'pending') {
    list = list.filter(t => t.completed === 0);
  } else if (filter.value === 'completed') {
    list = list.filter(t => t.completed === 1);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }

  return list;
});

const handleCreateTodo = async (input: CreateTodoInput) => {
  submitting.value = true;
  errorMessage.value = '';
  try {
    const newTodo = await createTodo(input);
    todos.value.unshift(newTodo);
    dbStatus.value.totalTodos = todos.value.length;
  } catch (err: any) {
    errorMessage.value = err.message || 'TODOの登録に失敗しました';
  } finally {
    submitting.value = false;
  }
};

const handleToggleCompleted = async (id: number, completed: boolean) => {
  updatingId.value = id;
  errorMessage.value = '';
  try {
    const updated = await toggleTodoCompleted(id, completed);
    const index = todos.value.findIndex(t => t.id === id);
    if (index !== -1) {
      todos.value[index] = updated;
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'ステータスの更新に失敗しました';
  } finally {
    updatingId.value = null;
  }
};

const handleUpdateTodo = async (id: number, updates: UpdateTodoInput) => {
  updatingId.value = id;
  errorMessage.value = '';
  try {
    const updated = await updateTodo(id, updates);
    const index = todos.value.findIndex(t => t.id === id);
    if (index !== -1) {
      todos.value[index] = updated;
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'TODOの更新に失敗しました';
  } finally {
    updatingId.value = null;
  }
};

const handleDeleteTodo = async (id: number) => {
  updatingId.value = id;
  errorMessage.value = '';
  try {
    await deleteTodo(id);
    todos.value = todos.value.filter(t => t.id !== id);
    dbStatus.value.totalTodos = todos.value.length;
  } catch (err: any) {
    errorMessage.value = err.message || 'TODOの削除に失敗しました';
  } finally {
    updatingId.value = null;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <!-- Top Bar Contract -->
    <AppHeader
      :active-tab="activeTab"
      :db-status="dbStatus"
      @change-tab="tab => activeTab = tab"
    />

    <!-- Main Content Area -->
    <main class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Error Notification Banner if any -->
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs sm:text-sm text-rose-800"
      >
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
          <span>{{ errorMessage }}</span>
        </div>
        <button
          type="button"
          @click="loadData"
          class="font-medium underline hover:text-rose-900 ml-4 cursor-pointer"
        >
          再読み込み
        </button>
      </div>

      <!-- Tab 1: TODO CRUD View -->
      <div v-if="activeTab === 'todos'" class="space-y-6">
        <!-- Dashboard Metrics & Progress -->
        <div class="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-lg font-bold text-slate-900 tracking-tight">TODO管理</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              フロントエンド(Vue) → バックエンド(Node.js/Express) → DB(SQLite) リアルタイムCRUD
            </p>
          </div>

          <div class="flex items-center gap-4 text-xs font-mono">
            <div class="flex flex-col">
              <span class="text-slate-400">進捗状況</span>
              <span class="text-sm font-semibold tabular-nums text-slate-900">
                {{ completedCount }} / {{ totalCount }} 完了 ({{ completionPercentage }}%)
              </span>
            </div>
            <div class="w-28 bg-slate-100 h-2.5 rounded-full overflow-hidden shrink-0">
              <div
                class="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Create TODO Form -->
        <TodoForm
          :submitting="submitting"
          @create-todo="handleCreateTodo"
        />

        <!-- Filter Controls and Search -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <!-- Segmented Filter Tabs -->
          <div class="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg shrink-0">
            <button
              type="button"
              @click="filter = 'all'"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer"
              :class="filter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
            >
              すべて (<span class="tabular-nums">{{ totalCount }}</span>)
            </button>
            <button
              type="button"
              @click="filter = 'pending'"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer"
              :class="filter === 'pending' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
            >
              未完了 (<span class="tabular-nums">{{ pendingCount }}</span>)
            </button>
            <button
              type="button"
              @click="filter = 'completed'"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer"
              :class="filter === 'completed' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
            >
              完了済み (<span class="tabular-nums">{{ completedCount }}</span>)
            </button>
          </div>

          <!-- Search Query Box -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="TODOを検索..."
              class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 bg-slate-200 rounded-md"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-slate-200 rounded w-1/3"></div>
                <div class="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredTodos.length === 0"
          class="bg-white border border-dashed border-slate-300 rounded-lg p-8 sm:p-12 text-center"
        >
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-slate-900">
            {{ searchQuery ? '検索条件に一致するTODOがありません' : '登録されているTODOはありません' }}
          </h3>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {{ searchQuery ? '検索キーワードを変更するか、クリアしてください。' : '上部の入力フォームから最初のTODOを作成してDBへ登録してみましょう。' }}
          </p>
        </div>

        <!-- Todo Items List -->
        <div v-else class="space-y-2.5">
          <TodoItem
            v-for="todo in filteredTodos"
            :key="todo.id"
            :todo="todo"
            :updating="updatingId === todo.id"
            @toggle-completed="handleToggleCompleted"
            @update-todo="handleUpdateTodo"
            @delete-todo="handleDeleteTodo"
          />
        </div>
      </div>

      <!-- Tab 2: Architecture Guide -->
      <ArchitectureGuide
        v-else-if="activeTab === 'architecture'"
        @switch-to-todos="activeTab = 'todos'"
      />

      <!-- Tab 3: API Reference -->
      <ApiReference
        v-else-if="activeTab === 'api'"
      />
    </main>

    <!-- Clean Footer -->
    <footer class="border-t border-slate-200 bg-white py-4 mt-auto">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div class="flex items-center gap-2">
          <span>Vue 3 + Node.js (Express) + SQLite Starter</span>
          <span aria-hidden="true">·</span>
          <span>Full-Stack Template</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="activeTab = 'architecture'"
            class="hover:text-slate-800 transition-colors cursor-pointer"
          >
            雛形構成を見る
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            @click="activeTab = 'api'"
            class="hover:text-slate-800 transition-colors cursor-pointer"
          >
            API仕様
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>
