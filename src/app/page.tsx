"use client";

import { useState, useRef, useEffect } from "react";

// ── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface KnowledgeItem {
  id: string;
  category: "faq" | "script" | "process";
  question: string;
  answer: string;
}

interface ConversationRecord {
  id: string;
  date: string;
  messages: Message[];
  status: "處理中" | "已完成";
}

// ── Knowledge Base Modal ────────────────────────────────────────────────────

function KBModal({
  items,
  onClose,
  onAdd,
  onDelete,
}: {
  items: KnowledgeItem[];
  onClose: () => void;
  onAdd: (item: KnowledgeItem) => void;
  onDelete: (id: string) => void;
}) {
  const [category, setCategory] = useState<"faq" | "script" | "process">("faq");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAdd = () => {
    if (!question.trim() || !answer.trim()) return;
    onAdd({ id: Date.now().toString(), category, question, answer });
    setQuestion("");
    setAnswer("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">知識庫管理</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-3 mb-6">
            {items.length === 0 && <p className="text-gray-400 text-sm">尚無知識庫項目</p>}
            {items.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      item.category === "faq" ? "bg-blue-100 text-blue-700" :
                      item.category === "script" ? "bg-green-100 text-green-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {item.category === "faq" ? "FAQ" : item.category === "script" ? "話術" : "流程"}
                    </span>
                    <p className="mt-1 font-semibold text-sm">{item.question}</p>
                    <p className="mt-1 text-sm text-gray-600">{item.answer}</p>
                  </div>
                  <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-600 text-sm ml-2">刪除</button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">新增項目</h3>
            <div className="flex gap-2 mb-2">
              {(["faq", "script", "process"] as const).map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    category === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                  {cat === "faq" ? "FAQ" : cat === "script" ? "話術" : "流程"}
                </button>
              ))}
            </div>
            <input className="w-full border rounded-xl px-4 py-2 mb-2 text-sm" placeholder="問題/標題"
              value={question} onChange={(e) => setQuestion(e.target.value)} />
            <textarea className="w-full border rounded-xl px-4 py-2 mb-2 text-sm" placeholder="回覆內容"
              value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} />
            <button onClick={handleAdd}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
              新增
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── History Modal ───────────────────────────────────────────────────────────

function HistoryModal({
  records,
  onClose,
}: {
  records: ConversationRecord[];
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<ConversationRecord | null>(null);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">對話歷史</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {records.length === 0 && <p className="text-gray-400 text-sm">尚無對話紀錄</p>}
          {records.map((record) => (
            <div key={record.id} className="border rounded-xl p-4 mb-3">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setSelected(selected?.id === record.id ? null : record)}>
                <div>
                  <p className="font-medium text-sm">{record.date}</p>
                  <p className="text-xs text-gray-500">{record.messages.length} 則訊息</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    record.status === "已完成" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{record.status}</span>
                  <span className="text-gray-400">{selected?.id === record.id ? "▲" : "▼"}</span>
                </div>
              </div>
              {selected?.id === record.id && (
                <div className="mt-3 space-y-2">
                  {selected.messages.map((msg) => (
                    <div key={msg.id} className={`text-sm p-2 rounded-lg ${msg.role === "user" ? "bg-blue-50 text-right" : "bg-gray-50"}`}>
                      <span className="font-bold text-xs">{msg.role === "user" ? "我" : "EliseAI"}</span>
                      <p>{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Settings Modal ──────────────────────────────────────────────────────────

function SettingsModal({
  openAIKey,
  onSave,
  onClose,
}: {
  openAIKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}) {
  const [key, setKey] = useState(openAIKey);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">設定</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <label className="block text-sm font-medium mb-2">OpenAI API Key（在 Vercel 環境變數設定）</label>
        <p className="text-xs text-gray-500 mb-4">於 Vercel 專案設定 OPENAI_API_KEY 環境變數，此處僅供顯示。</p>
        <p className="text-xs text-blue-600 bg-blue-50 rounded p-2 mb-4">
          請至 Vercel → Settings → Environment Variables 新增 <code className="font-mono">OPENAI_API_KEY</code>
        </p>
        <button onClick={onClose}
          className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition">
          關閉
        </button>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);
  const [showKBSModal, setShowKBSModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [records, setRecords] = useState<ConversationRecord[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          knowledgeBase,
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || data.error || "抱歉，發生錯誤。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "抱歉，發生錯誤，請稍後再試。",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    if (messages.length === 0) return;
    const dateStr = new Date().toLocaleString("zh-TW");
    setRecords((prev) => [
      {
        id: Date.now().toString(),
        date: dateStr,
        messages: [...messages],
        status: "已完成",
      },
      ...prev,
    ]);
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-blue-600">EliseAI</h1>
          <p className="text-xs text-gray-400">營運對話 AI</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowHistory(true)}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl transition">歷史</button>
          <button onClick={() => setShowKBSModal(true)}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl transition">知識庫</button>
          <button onClick={() => setShowSettings(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition">⚙️</button>
          <a href="/admin" target="_blank"
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl transition">📦</a>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-medium">開始與 EliseAI 對話</p>
            <p className="text-sm mt-1">輸入問題，快速獲得建議與指引</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xl rounded-2xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white border shadow-sm text-gray-800 rounded-bl-sm"
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                {msg.timestamp.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input area */}
      <footer className="bg-white border-t p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <textarea
            className="flex-1 border rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="輸入問題，按 Enter 發送..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button onClick={handleSend} disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
            送出
          </button>
          {messages.length > 0 && (
            <button onClick={handleSaveToHistory}
              className="bg-gray-100 text-gray-600 px-4 py-3 rounded-2xl hover:bg-gray-200 transition text-sm">
              存檔
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          {process.env.NEXT_PUBLIC_OPENAI_CONFIGURED ? "✅ OpenAI API 已設定" : "⚠️ 尚未設定 OpenAI API Key（使用 mock 模式）"}
        </p>
      </footer>

      {/* Modals */}
      {showKBSModal && (
        <KBModal
          items={knowledgeBase}
          onClose={() => setShowKBSModal(false)}
          onAdd={(item) => setKnowledgeBase((prev) => [...prev, item])}
          onDelete={(id) => setKnowledgeBase((prev) => prev.filter((k) => k.id !== id))}
        />
      )}

      {showHistory && (
        <HistoryModal records={records} onClose={() => setShowHistory(false)} />
      )}

      {showSettings && (
        <SettingsModal
          openAIKey=""
          onSave={() => {}}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
