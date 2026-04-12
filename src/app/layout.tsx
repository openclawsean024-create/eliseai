<<<<<<< HEAD
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
=======
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EliseAI 營運對話 AI",
  description: "支援營運團隊即時對話需求，整合常見問答、流程指引與任務追蹤",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
>>>>>>> c74a5026bd12c1f8919c6e62b9c0dcd38145b811
}
