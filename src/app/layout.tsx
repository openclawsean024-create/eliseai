import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EliseAI - 營運對話 AI',
  description: '企業內部營運對話 AI，協助員工快速查詢資訊、回答常見問題、記錄工作任務',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  )
}
