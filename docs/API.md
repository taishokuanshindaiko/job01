# API仕様書

## エンドポイント一覧

### 求人情報生成 API

求人情報を生成するためのエンドポイントです。

```typescript
POST /api/generate
```

#### リクエスト

```typescript
{
  "url": string // 企業サイトのURL
}
```

#### レスポンス

```typescript
{
  "success": boolean,
  "data": JobPosting,
  "message": string
}
```

#### エラーレスポンス

```typescript
{
  "success": false,
  "error": string
}
```

#### ステータスコード

- 200: 成功
- 400: バリデーションエラー
- 429: レート制限超過
- 500: サーバーエラー

### 求人情報取得 API

#### 全件取得

```typescript
GET /api/job-postings
```

#### レスポンス

```typescript
{
  "success": boolean,
  "data": JobPosting[]
}
```

#### 個別取得

```typescript
GET /api/job-postings/:id
```

#### レスポンス

```typescript
{
  "success": boolean,
  "data": JobPosting
}
```

#### エラーレスポンス

```typescript
{
  "success": false,
  "error": string
}
```

#### ステータスコード

- 200: 成功
- 404: 求人情報が見つからない
- 500: サーバーエラー

## レート制限

- ウィンドウサイズ: 1分
- 最大リクエスト数: 10回/分
- 制限超過時のステータスコード: 429

## エラーメッセージ

```typescript
{
  URL_REQUIRED: 'URLを入力してください',
  INVALID_URL: '有効な企業サイトのURLを入力してください',
  GENERATION_FAILED: 'AIによる求人情報の生成に失敗しました',
  INVALID_RESPONSE_FORMAT: 'AIからの応答形式が無効です',
  DATABASE_ERROR: 'データの保存に失敗しました',
  API_REQUEST_FAILED: 'AI APIへの接続に失敗しました',
  RATE_LIMIT_EXCEEDED: 'リクエスト制限を超えました'
}
```

## スキーママークアップ

生成される求人情報には自動的にSchema.orgのJobPostingマークアップが付与されます。

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": string,
  "description": string,
  "datePosted": string,
  "employmentType": string,
  "hiringOrganization": {
    "@type": "Organization",
    "name": string,
    "sameAs": string
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": string,
      "addressCountry": "JP"
    }
  },
  "skills": string,
  "experienceRequirements": string,
  "educationRequirements": string,
  "responsibilities": string,
  "qualifications": string,
  "jobBenefits": string
}
```