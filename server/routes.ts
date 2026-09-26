import { Router, type Request, type Response } from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from './db.js';

export const apiRouter = Router();

// GET /api/todos - 全TODO一覧取得
apiRouter.get('/todos', (_req: Request, res: Response) => {
  try {
    const todos = getAllTodos();
    res.json({
      success: true,
      data: todos
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch todos'
    });
  }
});

// GET /api/todos/:id - 単一TODO取得
apiRouter.get('/todos/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid ID format' });
      return;
    }
    const todo = getTodoById(id);
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }
    res.json({ success: true, data: todo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/todos - TODO新規作成 (Create)
apiRouter.post('/todos', (req: Request, res: Response) => {
  try {
    const { title, description, completed } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ success: false, error: 'Title is required' });
      return;
    }
    const newTodo = createTodo(
      title,
      typeof description === 'string' ? description : '',
      completed ? 1 : 0
    );
    res.status(201).json({ success: true, data: newTodo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/todos/:id - TODO全体更新 (Update)
apiRouter.put('/todos/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid ID format' });
      return;
    }
    const { title, description, completed } = req.body;
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      res.status(400).json({ success: false, error: 'Title cannot be empty' });
      return;
    }

    const updated = updateTodo(id, { title, description, completed });
    if (!updated) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/todos/:id - TODO部分更新 (Toggle completion / quick edit)
apiRouter.patch('/todos/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid ID format' });
      return;
    }
    const { title, description, completed } = req.body;
    const updated = updateTodo(id, { title, description, completed });
    if (!updated) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/todos/:id - TODO削除 (Delete)
apiRouter.delete('/todos/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid ID format' });
      return;
    }
    const success = deleteTodo(id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }
    res.json({ success: true, message: 'Todo deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/health - ヘルスチェックとDBステータス
apiRouter.get('/health', (_req: Request, res: Response) => {
  try {
    const todos = getAllTodos();
    res.json({
      status: 'ok',
      database: 'SQLite (sql.js WASM)',
      totalTodos: todos.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});
