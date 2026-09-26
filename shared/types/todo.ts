export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: number; // 0 for incomplete, 1 for completed
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  completed?: number;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: number | boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthInfo {
  status: string;
  database: string;
  totalTodos: number;
  timestamp: string;
}
