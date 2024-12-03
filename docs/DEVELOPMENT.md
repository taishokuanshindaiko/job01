# 開発ガイド

## 環境構築

### 必要な環境

- Node.js 18以上
- npm 9以上

### セットアップ手順

1. リポジトリのクローン

```bash
git clone <repository-url>
cd <repository-name>
```

2. 依存関係のインストール

```bash
npm install
```

3. 環境変数の設定

```bash
cp .env.example .env.local
```

必要な環境変数を設定してください：

- CLAUDE_API_KEY: Claude APIのキー
- CLAUDE_API_URL: Claude APIのエンドポイント
- DATABASE_URL: TursoデータベースのURL
- DATABASE_AUTH_TOKEN: データベースの認証トークン
- UPSTASH_REDIS_REST_URL: RedisのURL
- UPSTASH_REDIS_REST_TOKEN: Redisの認証トークン

4. データベースのセットアップ

```bash
npm run db:generate
npm run db:migrate
```

5. 開発サーバーの起動

```bash
npm run dev
```

## プロジェクト構成

```
.
├── app/                    # Next.js 13のApp Router
├── components/            # Reactコンポーネント
├── lib/                   # ユーティリティ関数とヘルパー
├── types/                # TypeScript型定義
├── public/               # 静的ファイル
└── docs/                 # ドキュメント
```

### 主要なディレクトリ

- `app/`: ページとAPIルート
- `components/`: 再利用可能なコンポーネント
- `lib/`: ビジネスロジックとユーティリティ
- `types/`: TypeScript型定義
- `docs/`: ドキュメント

## コーディング規約

### 命名規則

- コンポーネント: PascalCase
- 関数とメソッド: camelCase
- 定数: SCREAMING_SNAKE_CASE
- ファイル名: kebab-case

### インポート順序

1. React/Next.js関連
2. サードパーティライブラリ
3. 内部コンポーネント
4. ユーティリティ関数
5. 型定義
6. スタイル

### コンポーネント設計

- 単一責任の原則に従う
- Props型を明示的に定義
- エラーハンドリングを適切に実装
- パフォーマンスを考慮した実装

## テスト

### ユニットテスト

```bash
npm run test
```

### E2Eテスト

```bash
npm run test:e2e
```

## デプロイ

### ビルド

```bash
npm run build
```

### 本番環境用の設定

1. 環境変数の設定
2. データベースのマイグレーション
3. SSLの設定
4. キャッシュの設定

## トラブルシューティング

### よくある問題

1. 環境変数の設定ミス
2. データベース接続エラー
3. APIレート制限
4. ビルドエラー

### デバッグ方法

1. ログの確認
2. 環境変数の確認
3. ネットワーク接続の確認
4. データベース接続の確認

## パフォーマンス最適化

1. コンポーネントの最適化
   - メモ化
   - 遅延ロード
   - 適切なキー設定

2. 画像の最適化
   - Next.js Image
   - WebP形式
   - 適切なサイズ設定

3. バンドルサイズの最適化
   - コード分割
   - 動的インポート
   - 未使用コードの削除

4. キャッシュ戦略
   - ブラウザキャッシュ
   - APIレスポンスのキャッシュ
   - 静的生成の活用