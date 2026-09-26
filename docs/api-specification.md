# REST API 仕様書

本プロジェクトのバックエンド（Node.js / Express）が提供するRESTful APIの仕様です。
フロントエンド（Vue.js）とはJSON形式で通信を行います。

- **ベースパス**: `/api`
- **共通ヘッダー**: `Content-Type: application/json`

---

## エンドポイント一覧

| メソッド | エンドポイント | 説明 | リクエスト形式 | 主なレスポンス |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/todos` | 全TODO一覧の取得 (Read) | なし | `200 OK` + TODO配列 |
| `GET` | `/api/todos/:id` | 指定IDのTODO取得 (Read) | なし | `200 OK` / `404 Not Found` |
| `POST` | `/api/todos` | TODO新規作成 (Create) | JSON Body | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/todos/:id` | TODO全体更新 (Update) | JSON Body | `200 OK` / `404 Not Found` |
| `PATCH` | `/api/todos/:id` | 完了状態等の部分更新 | JSON Body | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/todos/:id` | TODO削除 (Delete) | なし | `200 OK` / `404 Not Found` |
| `GET` | `/api/health` | サーバー・DBヘルスチェック | なし | `200 OK` + ステータス情報 |

---

## 各エンドポイント詳細

### 1. 全TODO一覧取得

- **URL**: `GET /api/todos`
- **レスポンス例 (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "title": "タスク名",
        "description": "タスクの詳細説明",
        "completed": 0,
        "created_at": "2026-09-26T05:55:00.000Z",
        "updated_at": "2026-09-26T05:55:00.000Z"
      }
    ]
  }
  ```

---

### 2. 単一TODO取得

- **URL**: `GET /api/todos/:id`
- **URLパラメータ**: `id` (数値)
- **レスポンス例 (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "タスク名",
      "description": "タスクの詳細説明",
      "completed": 0,
      "created_at": "2026-09-26T05:55:00.000Z",
      "updated_at": "2026-09-26T05:55:00.000Z"
    }
  }
  ```

---

### 3. TODO新規作成

- **URL**: `POST /api/todos`
- **リクエストボディ**:
  ```json
  {
    "title": "新しいタスクのタイトル (必須)",
    "description": "任意の補足メモ",
    "completed": 0
  }
  ```
- **レスポンス例 (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "title": "新しいタスクのタイトル",
      "description": "任意の補足メモ",
      "completed": 0,
      "created_at": "2026-09-26T06:00:00.000Z",
      "updated_at": "2026-09-26T06:00:00.000Z"
    }
  }
  ```

---

### 4. TODO全体更新

- **URL**: `PUT /api/todos/:id`
- **リクエストボディ**:
  ```json
  {
    "title": "更新後のタイトル",
    "description": "更新後の詳細説明",
    "completed": 1
  }
  ```
- **レスポンス例 (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "title": "更新後のタイトル",
      "description": "更新後の詳細説明",
      "completed": 1,
      "created_at": "2026-09-26T06:00:00.000Z",
      "updated_at": "2026-09-26T06:05:00.000Z"
    }
  }
  ```

---

### 5. 完了状態等の部分更新

- **URL**: `PATCH /api/todos/:id`
- **リクエストボディ**:
  ```json
  {
    "completed": 1
  }
  ```
- **レスポンス例 (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "title": "更新後のタイトル",
      "description": "更新後の詳細説明",
      "completed": 1,
      "created_at": "2026-09-26T06:00:00.000Z",
      "updated_at": "2026-09-26T06:05:00.000Z"
    }
  }
  ```

---

### 6. TODO削除

- **URL**: `DELETE /api/todos/:id`
- **レスポンス例 (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Todo deleted successfully",
    "id": 2
  }
  ```

---

### 7. ヘルスチェック

- **URL**: `GET /api/health`
- **レスポンス例 (`200 OK`)**:
  ```json
  {
    "status": "ok",
    "database": "SQLite (sql.js WASM)",
    "totalTodos": 3,
    "timestamp": "2026-09-26T06:00:00.000Z"
  }
  ```
