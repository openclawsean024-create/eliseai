import { NextRequest, NextResponse } from "next/server";

// ── Mock fallback ───────────────────────────────────────────────────────────

function mockReply(lastMsg: string, kb: KnowledgeItem[]): string {
  const lower = lastMsg.toLowerCase();
  for (const item of kb) {
    if (
      lower.includes(item.question.toLowerCase()) ||
      item.question.toLowerCase().includes(lower)
    ) {
      const cat = item.category === "faq" ? "FAQ" : item.category === "script" ? "話術" : "流程";
      return `[知識庫回覆｜${cat}]\n${item.answer}`;
    }
  }
  const responses = [
    `收到您的問題：「${lastMsg}」\n\n已記錄並轉交相關人員處理。`,
    `關於「${lastMsg}」，請問您需要以下哪一種協助？\n\n1️⃣ 查看常見問題\n2️⃣ 新增知識庫項目\n3️⃣ 聯絡客服人員`,
    `感謝您的來訊！\n\n針對「${lastMsg}」，我們已收到並儘快為您處理。`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

interface KnowledgeItem {
  id: string;
  category: "faq" | "script" | "process";
  question: string;
  answer: string;
}

// ── API Route ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { messages, knowledgeBase }: { messages: { role: string; content: string }[]; knowledgeBase: KnowledgeItem[] } = await req.json();

    const lastMsg = messages[messages.length - 1]?.content || "";

    // Mock mode when no API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ role: "assistant", content: mockReply(lastMsg, knowledgeBase || []) });
    }

    // Real OpenAI API
    const systemPrompt = `你是 EliseAI，專門支援營運團隊的對話助理。
知識庫內容：${JSON.stringify(knowledgeBase || [], null, 2)}

請根據知識庫內容回覆。如果找不到相關資訊，請禮貌地說明並引導使用者。回覆使用繁體中文。`;

    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: allMessages,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error("OpenAI API error:", err);
      return NextResponse.json({ role: "assistant", content: mockReply(lastMsg, knowledgeBase || []) });
    }

    const data = await openaiRes.json();
    const content = data.choices?.[0]?.message?.content || mockReply(lastMsg, knowledgeBase || []);

    return NextResponse.json({ role: "assistant", content });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { role: "assistant", content: "抱歉，發生錯誤，請稍後再試。" },
      { status: 200 }
    );
  }
}
