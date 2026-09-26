import type { Todo, CreateTodoInput, UpdateTodoInput, ApiResponse, HealthInfo } from '../types/todo.ts';

const API_BASE = '/api';

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${API_BASE}/todos`);
  if (!res.ok) {
    throw new Error(`Failed to fetch todos: ${res.statusText}`);
  }
  const json: ApiResponse<Todo[]> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to fetch todos');
  }
  return json.data;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `Failed to create todo: ${res.statusText}`);
  }
  const json: ApiResponse<Todo> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to create todo');
  }
  return json.data;
}

export async function updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `Failed to update todo: ${res.statusText}`);
  }
  const json: ApiResponse<Todo> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to update todo');
  }
  return json.data;
}

export async function toggleTodoCompleted(id: number, completed: boolean): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: completed ? 1 : 0 }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `Failed to update todo status: ${res.statusText}`);
  }
  const json: ApiResponse<Todo> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to update todo status');
  }
  return json.data;
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `Failed to delete todo: ${res.statusText}`);
  }
  const json: ApiResponse<null> = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to delete todo');
  }
}

export async function checkHealth(): Promise<HealthInfo> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error('API server is not responding');
  }
  return res.json();
}
