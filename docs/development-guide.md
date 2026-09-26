# 開発・設計メモ & ワークフローガイド (Development Guide)

本ドキュメントは、本プロジェクトの**初期セットアップ手順**、**ディレクトリ分割の設計背景・経緯**、**実践的な機能拡張ステップ**、および**開発時によくあるトラブルシューティング**をまとめたガイドラインです。

> **💡 本プロジェクトの開発背景・アプローチについて**  
> 本プロジェクトの初期雛形構築、ディレクトリ分割のリファクタリング、UIデザインの調和、トラブル対応、および本ドキュメントの整備に至る一連の実装プロセスは、あえて **Gemini** に対するプロンプト指示を通じて全面委任（自律的なコード生成・リファクタリング・検証）するアプローチで実施・検証されています。プロンプトによる対話的な要求から、実用的なフルスタックWebアプリおよび開発ドキュメントがどのように構築・運用されたかの記録も兼ねています。

---

## 目次

1. [初期セットアップ手順](#1-初期セットアップ手順)
2. [ディレクトリ分割の経緯と設計思想](#2-ディレクトリ分割の経緯と設計思想)
3. [機能拡張・開発の推奨ステップ](#3-機能拡張開発の推奨ステップ)
4. [Git運用・コミット整理のベストプラクティス](#4-git運用コミット整理のベストプラクティス)
5. [トラブルシューティング](#5-トラブルシューティング)

---

## 1. 初期セットアップ手順

本スターターキットは、外部クラウドDBやDocker等の重い環境構築を必要とせず、Node.jsさえあれば数コマンドですぐにローカル起動できます。

### ① 前提環境
- **Node.js**: v20.x 以上（推奨: v22.x）
- **npm**: v10.x 以上

### ② 依存パッケージのインストール
リポジトリ直下で依存関係を一括インストールします。
```bash
npm install
```

### ③ 開発サーバーの起動
```bash
npm run dev
# または
npx tsx server.ts
```
起動すると、バックエンド（Express）とフロントエンド開発サーバー（Viteミドルウェア）が**単一のポート（3000）**で協調立ち上がりします。

- 🌐 **Web UI**: [http://localhost:3000](http://localhost:3000)
- 🔌 **API エンドポイント**: [http://localhost:3000/api/todos](http://localhost:3000/api/todos)

### ④ データベースの自動初期化
初回起動時、`server/db.ts` が実行され、リポジトリ直下に `data/` ディレクトリと `data/todos.sqlite` が自動生成されます。初期サンプルデータ（3件のTODO）が自動シードされるため、画面を開いた瞬間からCRUD操作の動作確認が可能です。

---

## 2. ディレクトリ分割の経緯と設計思想

### なぜ `client / server / shared / data` に分割したか？

初期プロジェクトではルート直下にフロントエンドとバックエンドのファイルが混在しやすい構成でしたが、将来の機能拡張やチーム開発を見据え、**「責務の明確な分離（Separation of Concerns）」**を実現するためにパターン1（フロント・バック・共通・DBの4層分離）を採用しました。

```text
├── client/                # 【フロントエンド (Vue.js 3 + Vite)】
│   ├── index.html         # HTMLエントリーポイント
│   └── src/
│       ├── main.ts        # Vue 3 エントリーポイント
│       ├── App.vue        # メイン画面・CRUD状態管理
│       ├── index.css      # Tailwind CSS v4 グローバルスタイル
│       ├── components/    # 再利用可能なUIコンポーネント (TodoItem, TodoForm等)
│       └── services/      # バックエンドAPIクライアント (fetchラッパー)
├── server/                # 【バックエンド (Node.js + Express)】
│   ├── index.ts           # サーバーエントリーポイント & Viteミドルウェア結合
│   ├── routes.ts          # RESTful API ルーティング (/api/todos)
│   └── db.ts              # SQLite (sql.js) 接続・CRUD SQL処理群
├── shared/                # 【共通コード・型定義】
│   └── types/
│       └── todo.ts        # フロント・サーバー間で共有するTypeScript型定義
├── data/                  # 【データベース実ファイル】
│   └── todos.sqlite       # WASM SQLite 永続化バイナリファイル
├── docs/                  # 【仕様書・設計メモ】
└── package.json           # プロジェクト共通設定
```

### 主なメリット
1. **フロントエンドとバックエンドの境界が明確**:
   どのコードがブラウザ側（`client`）で動き、どのコードがサーバー側（`server`）で動くのかが一目瞭然になります。
2. **型定義の共有（`shared/types`）**:
   TODOのデータ構造（`Todo`, `CreateTodoInput`, `UpdateTodoInput`）を `shared` に置くことで、フロントエンドの画面とサーバーのAPIルート間で**全く同一の型**を参照でき、APIの変更漏れを型チェック（`npm run lint`）で検知できます。
3. **シングルポート（3000）での統合開発**:
   Viteをスタンドアロンで動かすのではなく、Expressのミドルウェア（`vite.middlewares`）として統合。CORS（オリジン間リソース共有）の問題を気にすることなく、同じポートでフロントとAPIを開発できます。
4. **Viteの `root` 設定**:
   `vite.config.ts` で `root: 'client'` と設定することで、ブラウザから見えるルートパスを `client/` 配下に束縛し、サーバー側の機密ファイルやコードが不要に公開されるのを防ぎます。

---

## 3. 機能拡張・開発の推奨ステップ

新しい機能や項目（例: 期日 `due_date` や 優先度 `priority`）を追加する際は、以下の順番で進めると手戻りがなくスムーズです。

```
[1. DBスキーマ変更] ──▶ [2. 共通型定義の更新] ──▶ [3. バックエンドAPI] ──▶ [4. フロントエンドUI]
```

### ステップ1: DBスキーマ・クエリの拡張 (`server/db.ts`)
1. テーブル定義にカラムを追加（`CREATE TABLE IF NOT EXISTS todos ...`）
2. `createTodo`、`updateTodo` のSQL文とパラメータマッピングに新項目を追加

### ステップ2: 共通型定義の更新 (`shared/types/todo.ts`)
`Todo` インターフェースや入力用型（`CreateTodoInput` / `UpdateTodoInput`）に新しいプロパティを追加します。これにより、クライアントとサーバーの両方でTypeScriptの型チェックが有効になります。

### ステップ3: バックエンドAPIの確認 (`server/routes.ts`)
リクエストボディ（`req.body`）から新しいプロパティを受け取り、バリデーションを行う場合はここに追記します。

### ステップ4: フロントエンドUIの更新 (`client/src/`)
1. **APIクライアント (`client/src/services/api.ts`)**: 必要に応じてパラメータ送信を確認
2. **新規作成フォーム (`client/src/components/TodoForm.vue`)**: 入力フィールドを追加
3. **リスト表示・編集カード (`client/src/components/TodoItem.vue`)**: バッジ表示やインライン編集項目を追加

### ステップ5: スタイル定義の追加・共通化 (`client/src/index.css`)
本アプリは **Tailwind CSS v4** を採用しています。
共通のカラーやデザイントークンを登録したい場合は、`client/src/index.css` に `@theme` ブロックで定義できます。
```css
@import "tailwindcss";

@theme {
  --color-dashboard-header: #334155; /* slate-700 */
  --color-accent-brand: #10b981;     /* emerald-500 */
}
```

---

## 4. Git運用・コミット整理のベストプラクティス

開発を試行錯誤しながら進める場合、細かい単位でスナップショットを取りつつ、後でクリーンに統合（Squash）するのがおすすめです。

### ① スナップショットの作成（ローカルコミット）
機能の途中やスタイルの試作ごとに、ローカルで細かくコミットを残します（pushはしない）。
```bash
git add client/
git commit -m "style: TODOタイトルの配色調整（試作A）"
```

### ② 直近のコミットをまとめる（Squash）
細かい作業コミットが重なった場合、`git reset --soft` を用いることで安全に1つの意味あるコミットへ統合できます。
```bash
# 例: 直前の2つのコミットを1つに統合する場合
git reset --soft HEAD~2
git commit -m "style: ヘッダータブの整理、フッター開発ツールバー新設、およびUI配色の調和調整"
```

---

## 5. トラブルシューティング

### Q1. `Failed to load url /src/main.ts. Does the file exist?` というエラーが出る
- **原因**: 
  Viteのプロジェクトルートが `client/` に設定されているため、HTMLエントリーポイントは `client/index.html`（スクリプトパスは `/src/main.ts` ＝ 実体は `client/src/main.ts`）を参照します。
  `client/src/main.ts` や関連ファイルが誤って削除されたり移動された場合にこのエラーが発生します。
- **対処法**:
  Git管理下であれば、以下のコマンドで直前の正常コミットからファイルを復元できます。
  ```bash
  git restore client/src/
  ```

### Q2. データベースを初期状態（クリーン）に戻したい
- **対処法**:
  `data/todos.sqlite` を削除してサーバーを再起動するだけで、初期サンプルデータ付きの新しいDBが自動生成されます。
  ```bash
  rm data/todos.sqlite
  # サーバーを再起動
  ```

### Q3. ポート3000が既に使用されている（EADDRINUSE）
- **対処法**:
  環境変数 `PORT` を指定して別ポートで起動します。
  ```bash
  PORT=3001 npm run dev
  ```

### Q4. 型チェックやビルドが通るか確認したい
- **対処法**:
  以下のコマンドでTypeScriptのエラーやビルドの成否を素早く検証できます。
  ```bash
  # 型チェック (TypeScript noEmit)
  npm run lint

  # フロントエンドプロダクションビルド
  npm run build
  ```
