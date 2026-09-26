import initSqlJs, { type Database as SqlDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

let db: SqlDatabase | null = null;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'todos.sqlite');

export interface TodoRecord {
  id: number;
  title: string;
  description: string;
  completed: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

export async function initDatabase(): Promise<SqlDatabase> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Seed sample initial data if empty
  const countResult = db.exec('SELECT COUNT(*) as count FROM todos');
  const count = (countResult[0]?.values[0]?.[0] as number) ?? 0;
  if (count === 0) {
    const now = new Date().toISOString();
    db.run(
      `INSERT INTO todos (title, description, completed, created_at, updated_at) VALUES 
      (?, ?, 1, ?, ?),
      (?, ?, 0, ?, ?),
      (?, ?, 0, ?, ?);`,
      [
        'プロジェクトの雛形を確認する', 'Vue 3 + Node.js (Express) + SQLite の構成と動作を確認', now, now,
        'TODOの登録・編集・削除を試す', 'フロントエンドからバックエンドAPI経由でCRUDを実行', now, now,
        '要件に合わせてカスタマイズする', 'タスクの優先度やカテゴリ、期限などの項目を追加', now, now
      ]
    );
    saveDatabase();
  }

  return db;
}

function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buffer);
}

export function getAllTodos(): TodoRecord[] {
  if (!db) throw new Error('Database is not initialized');
  const result = db.exec('SELECT id, title, description, completed, created_at, updated_at FROM todos ORDER BY completed ASC, id DESC');
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  return result[0].values.map((row) => {
    const item: Record<string, any> = {};
    columns.forEach((col, idx) => {
      item[col] = row[idx];
    });
    return item as unknown as TodoRecord;
  });
}

export function getTodoById(id: number): TodoRecord | null {
  if (!db) throw new Error('Database is not initialized');
  const sanitizedId = Number(id);
  if (isNaN(sanitizedId)) return null;
  const result = db.exec(`SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE id = ${sanitizedId}`);
  if (!result || result.length === 0 || !result[0].values || result[0].values.length === 0) return null;
  const columns = result[0].columns;
  const row = result[0].values[0];
  const item: Record<string, any> = {};
  columns.forEach((col, idx) => {
    item[col] = row[idx];
  });
  return item as unknown as TodoRecord;
}

export function createTodo(title: string, description: string = '', completed: number = 0): TodoRecord {
  if (!db) throw new Error('Database is not initialized');
  const now = new Date().toISOString();
  db.run(
    'INSERT INTO todos (title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    [title.trim(), description.trim(), completed, now, now]
  );
  saveDatabase();
  const res = db.exec('SELECT id FROM todos ORDER BY id DESC LIMIT 1');
  if (!res || res.length === 0 || !res[0].values || res[0].values.length === 0) {
    throw new Error('Failed to retrieve newly created todo ID');
  }
  const newId = Number(res[0].values[0][0]);
  const created = getTodoById(newId);
  if (!created) {
    throw new Error('Created todo could not be retrieved');
  }
  return created;
}

export function updateTodo(id: number, updates: { title?: string; description?: string; completed?: number | boolean }): TodoRecord | null {
  if (!db) throw new Error('Database is not initialized');
  const existing = getTodoById(id);
  if (!existing) return null;

  const title = updates.title !== undefined ? updates.title.trim() : existing.title;
  const description = updates.description !== undefined ? updates.description.trim() : existing.description;
  const completed = updates.completed !== undefined ? (updates.completed ? 1 : 0) : existing.completed;
  const now = new Date().toISOString();

  db.run(
    'UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = ? WHERE id = ?',
    [title, description, completed, now, id]
  );
  saveDatabase();
  return getTodoById(id);
}

export function deleteTodo(id: number): boolean {
  if (!db) throw new Error('Database is not initialized');
  const existing = getTodoById(id);
  if (!existing) return false;

  db.run('DELETE FROM todos WHERE id = ?', [id]);
  saveDatabase();
  return true;
}
