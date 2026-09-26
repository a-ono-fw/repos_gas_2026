# 今後のカスタマイズ・機能拡張のヒント

本リポジトリは、仕様や詳細要件を徐々に詰めていけるよう、責務ごとにファイルを分離して構築しています。
機能追加やカスタマイズを行う際の具体的な手順とポイントを以下にまとめます。

---

## 1. タスク項目の追加（期日・優先度・カテゴリなど）

例として「優先度 (`priority`)」や「期限 (`due_date`)」を追加する場合の手順です。

### ① データベーススキーマの拡張 (`server/db.ts`)
- `CREATE TABLE IF NOT EXISTS todos` にカラムを追加します。
  ```sql
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium', -- 追加例: high, medium, low
    due_date TEXT DEFAULT NULL,     -- 追加例: YYYY-MM-DD
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );
  ```
- `createTodo` や `updateTodo` 関数の引数および SQL（`INSERT` / `UPDATE`）に新しい項目を反映します。

### ② TypeScript型定義の更新 (`shared/types/todo.ts`)
- `Todo`, `CreateTodoInput`, `UpdateTodoInput` インターフェースに項目を追加します。
  ```typescript
  export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: number;
    priority?: 'high' | 'medium' | 'low';
    due_date?: string | null;
    created_at: string;
    updated_at: string;
  }
  ```

### ③ フロントエンドUIの更新 (`client/src/components/`)
- **入力フォーム (`TodoForm.vue`)**:
  優先度セレクトボックスや日付ピッカーを追加し、送信時のペイロードに含めます。
- **カード表示・編集 (`TodoItem.vue`)**:
  優先度バッジや期限の表示、およびインライン編集時の入力コントロールを追加します。

---

## 2. フィルタ・検索・ソート機能の強化

- **優先度・ステータスによる絞り込み**:
  `src/App.vue` の `filteredTodos` （computed）に条件を追加するか、件数が増えた場合はバックエンドクエリ（`GET /api/todos?status=pending&priority=high`）にパラメータを渡してサーバーサイドフィルタリングに移行できます。
- **並び替え（ソート）**:
  期日順、作成日時順、優先度順などのソートドロップダウンを追加。

---

## 3. データベースの差し替え（本番運用時）

現在は即時利用可能なWebAssembly版SQLite（`sql.js`）を採用していますが、別のデータベースに移行したい場合もアーキテクチャの変更は最小限で済みます。

- **差し替え箇所**:
  `server/db.ts` 内の関数（`getAllTodos`, `createTodo`, `updateTodo`, `deleteTodo`）のみを書き換えます。
- **対応可能な移行先例**:
  - **PostgreSQL / MySQL**: `pg`, `mysql2`, または ORM（Prisma, Drizzle など）を導入。
  - **Cloud SQL / Supabase / Neon**: 接続文字列を設定し `server/db.ts` を移行。
  - **Firebase Firestore / MongoDB**: ドキュメント指向DB用クライアントへの差し替え。
- APIルート（`server/routes.ts`）やフロントエンド（Vue.js）側のコードは一切修正せずにDBを切り替えられます。

---

## 4. バリデーション & エラーハンドリングの強化

- `server/routes.ts` にて、`zod` などのバリデーションライブラリを導入することで、リクエストボディの厳密な型チェックやエラーメッセージのカスタマイズが容易に行えます。
