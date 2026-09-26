<script setup lang="ts">
const emit = defineEmits<{
  (e: 'switch-to-todos'): void;
}>();
</script>

<template>
  <div class="space-y-6">
    <!-- Top Summary Banner -->
    <div class="bg-white border border-slate-200 rounded-lg p-5">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-base font-semibold text-slate-900">
            プロジェクト雛形アーキテクチャの概要
          </h2>
          <p class="text-sm text-slate-600 mt-1 leading-relaxed">
            ご要望いただいた「フロントエンド: Vue.js」「バックエンド: Node.js」「DB: すぐに使えるDB」を
            <strong class="text-slate-800 font-semibold">client / server / shared / data</strong> の4つの責務に完全分離したフルスタック構成です。
          </p>
        </div>
        <button
          type="button"
          @click="emit('switch-to-todos')"
          class="shrink-0 px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors"
        >
          TODOアプリを試す →
        </button>
      </div>
    </div>

    <!-- 3 Core Tech Stacks -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Frontend -->
      <div class="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">V</span>
            <h3 class="text-sm font-semibold text-slate-900">フロントエンド: Vue.js 3</h3>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">
            Vite + Vue 3 (Composition API / <code class="text-slate-800 bg-slate-100 px-1 py-0.5 rounded">&lt;script setup&gt;</code>) + Tailwind CSS。
            コンポーネント指向でリアクティブに状態を管理し、APIと非同期通信します。
          </p>
          <ul class="text-xs text-slate-500 mt-3 space-y-1 list-disc list-inside">
            <li><code class="text-slate-700 font-mono">client/src/App.vue</code>: メイン画面</li>
            <li><code class="text-slate-700 font-mono">client/src/components/</code>: 部品化コンポーネント</li>
            <li><code class="text-slate-700 font-mono">client/src/services/api.ts</code>: APIクライアント</li>
          </ul>
        </div>
      </div>

      <!-- Backend -->
      <div class="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="w-6 h-6 rounded-md bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">N</span>
            <h3 class="text-sm font-semibold text-slate-900">バックエンド: Node.js (Express)</h3>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">
            ExpressフレームワークによるRESTful APIサーバー。
            リクエストのバリデーション、DBのクエリ実行、エラーハンドリングを担います。
          </p>
          <ul class="text-xs text-slate-500 mt-3 space-y-1 list-disc list-inside">
            <li><code class="text-slate-700 font-mono">server/index.ts</code>: サーバーエントリーポイント</li>
            <li><code class="text-slate-700 font-mono">server/routes.ts</code>: REST APIルーティング</li>
            <li>ポート: 3000 (Viteと統合稼働)</li>
          </ul>
        </div>
      </div>

      <!-- Database -->
      <div class="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="w-6 h-6 rounded-md bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">S</span>
            <h3 class="text-sm font-semibold text-slate-900">データベース: SQLite (sql.js)</h3>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">
            インストール後すぐ使えるPure WebAssembly SQLite。ネイティブコンパイル不要で即座に動作し、ファイルへ自動永続化されます。
          </p>
          <ul class="text-xs text-slate-500 mt-3 space-y-1 list-disc list-inside">
            <li><code class="text-slate-700 font-mono">server/db.ts</code>: DB初期化・CRUD関数</li>
            <li>保存先: <code class="text-slate-700 font-mono">data/todos.sqlite</code></li>
            <li>標準SQLで柔軟に変更可能</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Directory Structure Tree -->
    <div class="bg-white border border-slate-200 rounded-lg p-5">
      <h3 class="text-sm font-semibold text-slate-900 mb-3">📁 プロジェクトのディレクトリ構成</h3>
      <div class="bg-slate-950 text-slate-200 p-4 rounded-md font-mono text-xs overflow-x-auto leading-relaxed">
<pre>
├── client/                # 【フロントエンド (Vue.js 3)】
│   ├── index.html         # HTMLエントリーポイント
│   └── src/
│       ├── main.ts        # Vue 3 アプリケーション初期化
│       ├── App.vue        # メインアプリケーションコンポーネント
│       ├── index.css      # Tailwind CSS スタイル定義
│       ├── components/    # Vueコンポーネント群
│       │   ├── AppHeader.vue      # トップナビゲーション & ステータス表示
│       │   ├── TodoForm.vue       # TODO新規登録フォーム (Create)
│       │   ├── TodoItem.vue       # TODO個別カード (Read/Update/Delete)
│       │   ├── ArchitectureGuide.vue # プロジェクト構成解説
│       │   └── ApiReference.vue   # REST API仕様書
│       ├── services/
│       │   └── api.ts     # バックエンドAPI通信サービス
│       └── types/
│           └── todo.ts    # UI型定義 (sharedから再エクスポート)
├── server/                # 【バックエンド (Node.js & Express)】
│   ├── index.ts           # Expressサーバー起動 & Vite devミドルウェア統合
│   ├── routes.ts          # /api/todos REST API ルート定義
│   └── db.ts              # SQLiteデータベース初期化、スキーマ、CRUD関数
├── shared/                # 【フロント・バックエンド共通】
│   └── types/
│       └── todo.ts        # TodoエンティティおよびAPI型定義
├── data/                  # 【データベース実体・ストレージ】
│   └── todos.sqlite       # SQLiteデータベースファイル（自動生成・永続化）
├── docs/                  # 【設計・仕様ドキュメント】
│   ├── api-specification.md # REST API仕様書
│   └── extension-guide.md   # 機能拡張・カスタマイズガイド
├── server.ts              # サーバー起動ラッパー ("dev": "tsx server.ts")
├── package.json           # 依存パッケージ & 実行スクリプト
├── tsconfig.json          # TypeScript設定 (エイリアス: @, @shared)
└── vite.config.ts         # Vite設定 (root: client, Vue & Tailwind)
</pre>
      </div>
    </div>

    <!-- Next Steps Guide -->
    <div class="bg-white border border-slate-200 rounded-lg p-5">
      <h3 class="text-sm font-semibold text-slate-900 mb-2">今後の機能拡張ステップ（カスタマイズ例）</h3>
      <p class="text-xs text-slate-600 mb-4 leading-relaxed">
        詳細は徐々に詰めていけるよう、テーブルカラムやAPIの追加が容易な構造にしています。以下の拡張をいつでも追加できます:
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <span class="font-semibold text-slate-900 block mb-1">1. フィールドの追加</span>
          <span class="text-slate-600">
            締め切り期限 (<code class="font-mono">due_date</code>)、優先度 (<code class="font-mono">priority</code>: 高・中・低)、タグやカテゴリを追加。
          </span>
        </div>
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <span class="font-semibold text-slate-900 block mb-1">2. 検索・ソート・絞り込み</span>
          <span class="text-slate-600">
            キーワード検索、作成日順・期限順ソート、完了/未完了/カテゴリ別フィルタリングの強化。
          </span>
        </div>
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <span class="font-semibold text-slate-900 block mb-1">3. 一括操作機能</span>
          <span class="text-slate-600">
            全完了マーク、完了済みタスクの一括削除、ドラッグ&ドロップによる並び替え。
          </span>
        </div>
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <span class="font-semibold text-slate-900 block mb-1">4. 本格的DBへの移行 (必要時)</span>
          <span class="text-slate-600">
            現在は即時利用のSQLiteですが、PostgreSQLやFirestore等への差し替えも<code class="font-mono">server/db.ts</code>を変更するだけで可能。
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
