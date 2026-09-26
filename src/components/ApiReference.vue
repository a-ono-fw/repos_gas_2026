<template>
  <div class="space-y-6">
    <div class="bg-white border border-slate-200 rounded-lg p-5">
      <h2 class="text-base font-semibold text-slate-900">Node.js (Express) バックエンド REST API仕様</h2>
      <p class="text-xs text-slate-600 mt-1">
        フロントエンド（Vue.js）と通信するエンドポイント一覧です。すべてJSON形式でやり取りします。
      </p>
    </div>

    <div class="space-y-3">
      <!-- GET /api/todos -->
      <div class="bg-white border border-slate-200 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2 font-mono text-xs">
          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded">GET</span>
          <span class="font-semibold text-slate-800">/api/todos</span>
          <span class="text-slate-400">· 全TODOの取得 (Read)</span>
        </div>
        <p class="text-xs text-slate-600 mb-2">DBから全件取得して完了状態およびID降順でソートして返却します。</p>
        <div class="bg-slate-900 text-slate-300 p-3 rounded text-xs font-mono">
<pre>{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "タスク名",
      "description": "詳細メモ",
      "completed": 0,
      "created_at": "2026-09-25T22:50:00.000Z",
      "updated_at": "2026-09-25T22:50:00.000Z"
    }
  ]
}</pre>
        </div>
      </div>

      <!-- POST /api/todos -->
      <div class="bg-white border border-slate-200 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2 font-mono text-xs">
          <span class="px-2 py-0.5 bg-sky-100 text-sky-800 font-semibold rounded">POST</span>
          <span class="font-semibold text-slate-800">/api/todos</span>
          <span class="text-slate-400">· TODOの新規登録 (Create)</span>
        </div>
        <p class="text-xs text-slate-600 mb-2">リクエストボディでタイトルと詳細を受け取り、DBへINSERTします。</p>
        <div class="bg-slate-900 text-slate-300 p-3 rounded text-xs font-mono">
<pre>// Request Body:
{ "title": "新しいタスク", "description": "補足メモ" }

// Response (201 Created):
{ "success": true, "data": { "id": 4, "title": "新しいタスク", ... } }</pre>
        </div>
      </div>

      <!-- PUT /api/todos/:id -->
      <div class="bg-white border border-slate-200 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2 font-mono text-xs">
          <span class="px-2 py-0.5 bg-amber-100 text-amber-800 font-semibold rounded">PUT</span>
          <span class="font-semibold text-slate-800">/api/todos/:id</span>
          <span class="text-slate-400">· TODOの編集・更新 (Update)</span>
        </div>
        <p class="text-xs text-slate-600 mb-2">指定IDのTODOを更新します。</p>
        <div class="bg-slate-900 text-slate-300 p-3 rounded text-xs font-mono">
<pre>// Request Body:
{ "title": "更新後のタイトル", "description": "更新後の説明" }

// Response (200 OK):
{ "success": true, "data": { "id": 1, ... } }</pre>
        </div>
      </div>

      <!-- PATCH /api/todos/:id -->
      <div class="bg-white border border-slate-200 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2 font-mono text-xs">
          <span class="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-semibold rounded">PATCH</span>
          <span class="font-semibold text-slate-800">/api/todos/:id</span>
          <span class="text-slate-400">· 完了状態の切り替え</span>
        </div>
        <p class="text-xs text-slate-600 mb-2">完了フラグ（completed: 0または1）の部分更新を行います。</p>
        <div class="bg-slate-900 text-slate-300 p-3 rounded text-xs font-mono">
<pre>// Request Body:
{ "completed": 1 }

// Response (200 OK):
{ "success": true, "data": { ... } }</pre>
        </div>
      </div>

      <!-- DELETE /api/todos/:id -->
      <div class="bg-white border border-slate-200 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2 font-mono text-xs">
          <span class="px-2 py-0.5 bg-rose-100 text-rose-800 font-semibold rounded">DELETE</span>
          <span class="font-semibold text-slate-800">/api/todos/:id</span>
          <span class="text-slate-400">· TODOの削除 (Delete)</span>
        </div>
        <p class="text-xs text-slate-600 mb-2">指定IDのTODOレコードをDBから物理削除します。</p>
        <div class="bg-slate-900 text-slate-300 p-3 rounded text-xs font-mono">
<pre>// Response (200 OK):
{ "success": true, "message": "Todo deleted successfully", "id": 1 }</pre>
        </div>
      </div>
    </div>
  </div>
</template>
