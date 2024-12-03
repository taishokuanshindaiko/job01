import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'AI求人情報生成システム',
  description: '企業サイトから魅力的な求人情報を自動生成し、検索エンジン最適化された採用ページを作成します',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link 
          rel="preconnect" 
          href={process.env.CLAUDE_API_URL} 
          crossOrigin="anonymous" 
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}