# AI求人情報生成システム

企業サイトから魅力的な求人情報を自動生成し、検索エンジン最適化された採用ページを作成するシステムです。

## 機能

- 企業サイトURLからAIによる求人情報の自動生成
- 検索エンジン最適化（SEO）対応
- スキーママークアップの自動生成
- レスポンシブデザイン
- ダークモード対応
- エラーハンドリング
- レート制限

## 技術スタック

- Next.js 13
- TypeScript
- Tailwind CSS
- shadcn/ui
- Claude API
- Turso (SQLite)
- Drizzle ORM
- Zod
- React Hook Form

## 環境構築

1. 必要な環境変数を設定

```bash
# .env.local
CLAUDE_API_KEY=your-api-key
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
DATABASE_URL=your-database-url
DATABASE_AUTH_TOKEN=your-auth-token
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

2. 依存関係のインストール

```bash
npm install
```

3. データベースのマイグレーション

```bash
npm run db:generate
npm run db:migrate
```

4. 開発サーバーの起動

```bash
npm run dev
```

## API仕様

### 求人情報生成 API

```typescript
POST /api/generate

// リクエスト
{
  "url": string // 企業サイトのURL
}

// レスポンス
{
  "success": boolean,
  "data": JobPosting,
  "message": string
}
```

### 求人情報取得 API

```typescript
GET /api/job-postings
GET /api/job-postings/:id

// レスポンス
{
  "success": boolean,
  "data": JobPosting | JobPosting[],
  "message?: string
}
```

## コンポーネント

### JobPostingForm

求人情報生成フォームコンポーネント

```typescript
interface JobPostingFormProps {
  onSuccess: (jobPosting: JobPosting) => void;
  onGenerateStart: () => void;
}
```

### JobPostingPreview

生成された求人情報のプレビューコンポーネント

```typescript
interface JobPostingPreviewProps {
  jobPosting: JobPosting;
}
```

## データ型

### JobPosting

```typescript
interface JobPosting {
  id: number;
  companyUrl: string;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  location: string;
  salary: string | null;
  employmentType: string;
  experience: string;
  education: string | null;
  skills: string;
  responsibilities: string;
  department: string | null;
  contactInfo: string | null;
  applicationDeadline: string | null;
  createdAt: number;
  updatedAt: number;
}
```

## エラーハンドリング

システムは以下のエラーを適切に処理します：

- バリデーションエラー
- API通信エラー
- データベースエラー
- レート制限エラー
- 予期せぬエラー

各エラーは適切なエラーメッセージとともにユーザーに表示されます。

## パフォーマンス最適化

- コンポーネントの適切な分割
- 画像の最適化
- バンドルサイズの最適化
- キャッシュ戦略
- レート制限の実装

## セキュリティ対策

- 入力値のバリデーション
- APIキーの保護
- レート制限
- CORS設定
- XSS対策

## 今後の展開

- CSVエクスポート機能
- 複数の求人プラットフォームへの連携
- AIモデルの改善
- 多言語対応
- アナリティクス機能の追加