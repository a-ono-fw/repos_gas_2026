# Vue.js 3 + Node.js + SQLite TODO App (雛形スターターキット)

Vue 3（フロントエンド）、Node.js / Express（バックエンド）、および即時利用可能なSQLite（データベース）で構成された、フルスタックTODO管理アプリケーションの雛形プロジェクトです。

外部クラウドサービスのセットアップや複雑な初期設定なしで、ローカル環境ですぐに起動してCRUD（登録・参照・更新・削除）の動作確認および機能拡張が行えます。

---

## 🌟 主な特徴

- **ゼロコンフィグDB (SQLite / WebAssembly)**:
  ネイティブビルド不要な `sql.js` (WASM版SQLite) を採用。起動と同時に `data/todos.sqlite` へ自動永続化されます。
- **モダンなフロントエンド**:
  Vue 3 (Composition API / `<script setup>`) + Vite + TypeScript + Tailwind CSS によるクリーンでレスポンシブなUI。
- **フルスタック統合**:
  開発時はExpressサーバー上でViteの開発ミドルウェアが統合動作し、単一ポート（3000）でフロントとAPIが協調して動作します。
- **型安全性**:
  フロントエンドとバックエンドの通信型定義（`src/types/todo.ts`）を用意。
- **拡張しやすい設計**:
  DBアクセス、APIルート、Vueコンポーネントが責務ごとに疎結合に分離されており、タスクの期日や優先度などの独自項目追加が容易です。

---

## 🛠️ 技術スタック

| レイヤー | 技術 | 用途 / 詳細 |
| :--- | :--- | :--- |
| **フロントエンド** | Vue 3 (`^3.5`) | UI構築（Composition API, `<script setup lang="ts">`） |
| **ビルド / 開発** | Vite 8 + TypeScript | 高速HMR・トランスパイル・型チェック |
| **スタイリング** | Tailwind CSS v4 | ユーティリティファーストCSS |
| **バックエンド** | Node.js + Express (`^4.21`) | RESTful API サーバー (`server.ts`, `server/routes.ts`) |
| **データベース** | SQLite (`sql.js`) | ファイルベース永続化 (`data/todos.sqlite`) |
| **実行ツール** | tsx | TypeScript直接実行 (`tsx server.ts`) |

---

## 📁 ディレクトリ構成

```text
├── client/                # 【フロントエンド (Vue.js 3)】
│   ├── index.html         # HTMLエントリーポイント
│   └── src/
│       ├── main.ts        # Vue 3 アプリケーション起動 entrypoint
│       ├── App.vue        # メイン画面 (状態管理、タブ切り替え、CRUD連携)
│       ├── index.css      # グローバルスタイル (Tailwind CSS)
│       ├── vite-env.d.ts  # Vueコンポーネント型宣言
│       ├── types/
│       │   └── todo.ts    # UI用型定義 (sharedから再エクスポート)
│       ├── services/
│       │   └── api.ts     # バックエンドAPI通信クライアント (`fetch` ラッパー)
│       └── components/
│           ├── AppHeader.vue         # ヘッダー (タブ切り替え・DB接続ステータス)
│           ├── TodoForm.vue          # TODO新規作成フォーム (Create)
│           ├── TodoItem.vue          # TODO個別カード (インライン編集/削除/完了切替)
│           ├── ArchitectureGuide.vue # プロジェクト構成の解説画面
│           └── ApiReference.vue      # REST API仕様ビューア
├── server/                # 【バックエンド (Node.js & Express)】
│   ├── index.ts           # Expressサーバー起動 & Vite devミドルウェア統合
│   ├── routes.ts          # /api/todos REST API ルートハンドラー
│   └── db.ts              # SQLite初期化、スキーマ定義、CRUD処理関数群
├── shared/                # 【フロント・バックエンド共通】
│   └── types/
│       └── todo.ts        # TodoエンティティおよびAPIリクエスト/レスポンス型定義
├── data/                  # 【データベース実体・ストレージ】
│   ├── .gitkeep           # DBファイル格納用ディレクトリ
│   └── todos.sqlite       # SQLite DBファイル (実行時に自動生成・永続化)
├── docs/                  # 【設計・仕様ドキュメント】
│   ├── api-specification.md   # REST API詳細仕様書
│   └── extension-guide.md     # 今後のカスタマイズ・機能拡張のヒント
├── server.ts              # サーバー起動用ラッパー (npm run dev / start)
├── package.json           # 依存パッケージ・スクリプト定義
├── tsconfig.json          # TypeScript設定 (パスエイリアス: @, @shared)
└── vite.config.ts         # Vite設定 (root: client, Vue & Tailwind)
```

---

## 🚀 セットアップ & 実行手順

### 1. 依存パッケージのインストール

```bash
npm install
# または
bun install
```

### 2. 開発サーバーの起動

```bash
npm run dev
# または
bun run dev
```

起動後、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。
- 画面上部の「TODOリスト」で登録・編集・削除の動作確認ができます。
- 「構成・雛形ガイド」タブでアーキテクチャの解説を確認できます。
- 「REST API仕様」タブでバックエンドAPIの入出力スキーマを確認できます。

### 3. プロダクションビルド & 起動

```bash
# フロントエンドのアセットビルド (dist/ へ出力)
npm run build

# 本番サーバー起動
npm run start
```

### 4. 型チェック (Lint)

```bash
npm run lint
```

---

## 📚 ドキュメント

プロジェクトの詳細仕様および拡張ガイドは `docs/` ディレクトリにまとめています。

- **[REST API 仕様書](docs/api-specification.md)**:
  エンドポイント一覧、リクエスト/レスポンス形式、ステータスコードの詳細
- **[カスタマイズ・機能拡張のヒント](docs/extension-guide.md)**:
  タスク項目（期日・優先度等）の追加手順、フィルタ機能強化、DB差し替え手順など
