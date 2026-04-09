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
}
