# 実装解説資料 - Go & React/TypeScript 掲示板

このドキュメントでは、作成した掲示板アプリケーションの各コードについて解説します。

## 1. バックエンド (Go) - [main.go]

Ginフレームワークを使用したAPIサーバーです。

### 構造体とデータ管理
```go
type Post struct {
	ID        int       `json:"id"`
	Title     string    `json:"title" binding:"required"`
	Content   string    `json:"content" binding:"required"`
	CreatedAt time.Time `json:"created_at"`
}
```
- **Post**: 投稿データの構造を定義しています。`json:"..."` タグはJSON通信時のフィールド名を指定し、`binding:"required"` は入力必須であることを意味します。

```go
var (
	posts  = []Post{}
	nextID = 1
	mu     sync.Mutex
)
```
- **posts**: メモリ内に投稿を保存するスライスです。
- **mu (sync.Mutex)**: 複数のユーザーが同時にアクセスしてもデータが壊れないよう、読み書きを排他制御するための「鍵」です。

### サーバー設定 (main関数)
- **cors.New**: フロントエンド（localhost:5173）からのアクセスを許可するための設定（CORS）を行っています。
- **api.GET/POST**: 各URLとそれに対応する関数（ハンドラー）を紐付けています。

---

## 2. フロントエンド (React/TypeScript)

### ロジックと通信 - [main.tsx]

```typescript
const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    if (res.ok) {
        const data = await res.json();
        setPosts(data);
    }
};
```
- **fetchPosts**: バックエンドの `GET /api/posts` を呼び出し、取得したデータを画面の状態（posts）に反映させます。

```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ページのリロードを防ぐ
    const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
    });
    // ...投稿成功後に一覧を再取得
};
```
- **handleSubmit**: フォームが送信された際、入力内容をJSONとしてバックエンドに `POST` 送信します。

### デザイン - [index.css]
- **Tailwind CSS**: `@tailwind` 命令を使用し、ユーティリティファーストなCSSフレームワークを有効化しています。
- **glass**: 背景をぼかす「グラスモーフィズム」効果を手動で定義し、リッチな質感を演出しています。

---

## 3. セットアップガイド

### フォルダ構成
- `/`: プロジェクトルート
  - `main.go`: バックエンドサーバー
  - `/frontend`: フロントエンドプロジェクト
    - `package.json`: 依存ライブラリの定義
    - `vite.config.ts`: Viteの設定（APIのプロキシ設定含む）
    - `src/main.tsx`: メインのアプリケーションコード

### 確認手順
1. `frontend` フォルダで `npm install` を実行し、必要な部品をダウンロード。
2. `npm run dev` でフロントエンドを起動。
3. ルートフォルダで `go run main.go` でバックエンドを起動。
4. ブラウザで確認！
